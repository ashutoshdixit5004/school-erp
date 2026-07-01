import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateStudentDto) {
    return this.prisma.student.create({ data: dto });
  }

  findAll(sectionId?: string) {
    return this.prisma.student.findMany({
      where: sectionId ? { sectionId } : undefined,
      include: { section: { include: { class: true } }, guardians: { include: { guardian: true } } },
      orderBy: { firstName: 'asc' },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        section: { include: { class: true } },
        guardians: { include: { guardian: true } },
        feeInvoices: true,
        examResults: { include: { examSubject: { include: { subject: true } } } },
      },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  update(id: string, dto: UpdateStudentDto) {
    return this.prisma.student.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.student.delete({ where: { id } });
  }
}
