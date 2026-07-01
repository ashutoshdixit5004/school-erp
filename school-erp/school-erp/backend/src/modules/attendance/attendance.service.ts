import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { MarkAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  // Upserts the whole day's attendance for a section in one call —
  // teachers mark a full class roster at once, not student by student.
  async markAttendance(takenById: string, dto: MarkAttendanceDto) {
    const date = new Date(dto.date);

    return this.prisma.$transaction(async (tx) => {
      const record = await tx.attendanceRecord.upsert({
        where: { sectionId_date: { sectionId: dto.sectionId, date } },
        update: {},
        create: { sectionId: dto.sectionId, date, takenById },
      });

      await tx.attendanceEntry.deleteMany({ where: { attendanceRecordId: record.id } });

      await tx.attendanceEntry.createMany({
        data: dto.entries.map((e) => ({
          attendanceRecordId: record.id,
          studentId: e.studentId,
          status: e.status,
          remarks: e.remarks,
        })),
      });

      return tx.attendanceRecord.findUnique({
        where: { id: record.id },
        include: { entries: { include: { student: true } } },
      });
    });
  }

  getBySection(sectionId: string, date: string) {
    return this.prisma.attendanceRecord.findUnique({
      where: { sectionId_date: { sectionId, date: new Date(date) } },
      include: { entries: { include: { student: true } } },
    });
  }

  async getStudentSummary(studentId: string) {
    const entries = await this.prisma.attendanceEntry.findMany({
      where: { studentId },
    });
    const total = entries.length;
    const present = entries.filter((e) => e.status === 'PRESENT').length;
    return {
      totalDays: total,
      presentDays: present,
      attendancePercentage: total ? Math.round((present / total) * 10000) / 100 : 0,
    };
  }
}
