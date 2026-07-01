import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
  CreateAdmissionApplicationDto,
  DecideAdmissionApplicationDto,
} from './dto/admission.dto';

@Injectable()
export class AdmissionsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAdmissionApplicationDto) {
    return this.prisma.admissionApplication.create({ data: dto });
  }

  findAll(status?: string) {
    return this.prisma.admissionApplication.findMany({
      where: status ? { status: status as any } : undefined,
      include: { applyingClass: true, academicYear: true, documents: true },
      orderBy: { applicationDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const app = await this.prisma.admissionApplication.findUnique({
      where: { id },
      include: { applyingClass: true, academicYear: true, documents: true },
    });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async uploadDocument(applicationId: string, docType: string, fileUrl: string) {
    await this.findOne(applicationId);
    return this.prisma.admissionDocument.create({
      data: { applicationId, docType, fileUrl },
    });
  }

  // Approving an application converts it into a real Student record,
  // in the same transaction, so the two never get out of sync.
  async decide(id: string, dto: DecideAdmissionApplicationDto) {
    const application = await this.findOne(id);

    if (dto.status !== 'APPROVED') {
      return this.prisma.admissionApplication.update({
        where: { id },
        data: { status: dto.status },
      });
    }

    if (!dto.sectionId) {
      throw new BadRequestException('sectionId is required to approve an application');
    }

    return this.prisma.$transaction(async (tx) => {
      const admissionNo = `ADM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const student = await tx.student.create({
        data: {
          admissionNo,
          firstName: application.applicantName.split(' ')[0],
          lastName: application.applicantName.split(' ').slice(1).join(' ') || '-',
          dob: application.dob,
          gender: application.gender,
          sectionId: dto.sectionId,
        },
      });

      await tx.guardian.create({
        data: {
          firstName: application.guardianName,
          lastName: '',
          relation: 'Guardian',
          phone: application.guardianPhone,
          email: application.guardianEmail,
          students: {
            create: { studentId: student.id, isPrimary: true },
          },
        },
      });

      return tx.admissionApplication.update({
        where: { id },
        data: { status: 'APPROVED', convertedStudentId: student.id },
      });
    });
  }
}
