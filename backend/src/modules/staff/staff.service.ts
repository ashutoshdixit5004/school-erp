import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateStaffDto, RunPayrollDto } from './dto/staff.dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  create(schoolId: string, dto: CreateStaffDto) {
    return this.prisma.staff.create({ data: { ...dto, schoolId } });
  }

  findAll(schoolId: string) {
    return this.prisma.staff.findMany({ where: { schoolId }, orderBy: { firstName: 'asc' } });
  }

  async findOne(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: { subjects: { include: { subject: true } }, payrollRecords: true },
    });
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff;
  }

  runPayroll(dto: RunPayrollDto) {
    const allowances = dto.allowances ?? 0;
    const deductions = dto.deductions ?? 0;
    const netSalary = dto.basicSalary + allowances - deductions;

    return this.prisma.payrollRecord.upsert({
      where: { staffId_month_year: { staffId: dto.staffId, month: dto.month, year: dto.year } },
      update: { basicSalary: dto.basicSalary, allowances, deductions, netSalary },
      create: {
        staffId: dto.staffId,
        month: dto.month,
        year: dto.year,
        basicSalary: dto.basicSalary,
        allowances,
        deductions,
        netSalary,
      },
    });
  }

  markPaid(payrollRecordId: string) {
    return this.prisma.payrollRecord.update({
      where: { id: payrollRecordId },
      data: { status: 'PAID', paidAt: new Date() },
    });
  }
}
