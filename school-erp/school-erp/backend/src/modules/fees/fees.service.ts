import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateInvoiceDto, RecordPaymentDto } from './dto/fees.dto';

@Injectable()
export class FeesService {
  constructor(private prisma: PrismaService) {}

  createInvoice(dto: CreateInvoiceDto) {
    return this.prisma.feeInvoice.create({ data: dto });
  }

  getStudentInvoices(studentId: string) {
    return this.prisma.feeInvoice.findMany({
      where: { studentId },
      include: { payments: true, feeStructure: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  // Recording a payment recalculates the invoice status from the sum of
  // all payments, so status never has to be set by hand and drift.
  async recordPayment(dto: RecordPaymentDto) {
    const invoice = await this.prisma.feeInvoice.findUnique({
      where: { id: dto.invoiceId },
      include: { payments: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.feePayment.create({ data: dto });

      const paidSoFar =
        invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0) + Number(dto.amount);
      const total = Number(invoice.totalAmount);

      if (paidSoFar > total) {
        throw new BadRequestException('Payment exceeds invoice total');
      }

      const status = paidSoFar >= total ? 'PAID' : paidSoFar > 0 ? 'PARTIALLY_PAID' : 'PENDING';

      await tx.feeInvoice.update({
        where: { id: dto.invoiceId },
        data: { status },
      });

      return payment;
    });
  }

  async getCollectionSummary(academicYearId: string) {
    const invoices = await this.prisma.feeInvoice.findMany({
      where: { feeStructure: { academicYearId } },
      include: { payments: true },
    });
    const totalBilled = invoices.reduce((s, i) => s + Number(i.totalAmount), 0);
    const totalCollected = invoices.reduce(
      (s, i) => s + i.payments.reduce((ps, p) => ps + Number(p.amount), 0),
      0,
    );
    return { totalBilled, totalCollected, outstanding: totalBilled - totalCollected };
  }
}
