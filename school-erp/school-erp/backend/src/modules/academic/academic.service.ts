import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AcademicService {
  constructor(private prisma: PrismaService) {}

  createSchool(data: { name: string; address?: string; phone?: string; email?: string }) {
    return this.prisma.school.create({ data });
  }

  createAcademicYear(schoolId: string, data: { name: string; startDate: string; endDate: string; isCurrent?: boolean }) {
    return this.prisma.academicYear.create({
      data: {
        schoolId,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isCurrent: data.isCurrent ?? false,
      },
    });
  }

  createClass(academicYearId: string, data: { name: string; numericLevel: number }) {
    return this.prisma.class.create({ data: { ...data, academicYearId } });
  }

  createSection(classId: string, data: { name: string; capacity?: number }) {
    return this.prisma.section.create({ data: { ...data, classId } });
  }

  createSubject(schoolId: string, data: { name: string; code?: string }) {
    return this.prisma.subject.create({ data: { ...data, schoolId } });
  }

  linkSubjectToClass(classId: string, subjectId: string) {
    return this.prisma.subjectClass.create({ data: { classId, subjectId } });
  }

  getClassesForYear(academicYearId: string) {
    return this.prisma.class.findMany({
      where: { academicYearId },
      include: { sections: true, subjects: { include: { subject: true } } },
    });
  }
}
