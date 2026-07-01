import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RecordResultDto } from './dto/exams.dto';

function gradeFor(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async recordResult(dto: RecordResultDto) {
    const examSubject = await this.prisma.examSubject.findUnique({ where: { id: dto.examSubjectId } });
    if (!examSubject) throw new NotFoundException('Exam subject not found');

    const percentage = (dto.marksObtained / Number(examSubject.maxMarks)) * 100;

    return this.prisma.examResult.upsert({
      where: { examSubjectId_studentId: { examSubjectId: dto.examSubjectId, studentId: dto.studentId } },
      update: { marksObtained: dto.marksObtained, grade: gradeFor(percentage), remarks: dto.remarks },
      create: {
        examSubjectId: dto.examSubjectId,
        studentId: dto.studentId,
        marksObtained: dto.marksObtained,
        grade: gradeFor(percentage),
        remarks: dto.remarks,
      },
    });
  }

  // Builds a full report card for a student across every subject in a term.
  async getReportCard(studentId: string, examTermId: string) {
    const results = await this.prisma.examResult.findMany({
      where: { studentId, examSubject: { examTermId } },
      include: { examSubject: { include: { subject: true } } },
    });

    const totalMax = results.reduce((s, r) => s + Number(r.examSubject.maxMarks), 0);
    const totalObtained = results.reduce((s, r) => s + Number(r.marksObtained), 0);
    const overallPercentage = totalMax ? Math.round((totalObtained / totalMax) * 10000) / 100 : 0;

    return {
      studentId,
      examTermId,
      subjects: results.map((r) => ({
        subject: r.examSubject.subject.name,
        maxMarks: r.examSubject.maxMarks,
        marksObtained: r.marksObtained,
        grade: r.grade,
      })),
      totalMax,
      totalObtained,
      overallPercentage,
      overallGrade: gradeFor(overallPercentage),
    };
  }
}
