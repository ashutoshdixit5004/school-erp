import { PaymentMethod } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateInvoiceDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  feeStructureId: string;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsDateString()
  dueDate: string;
}

export class RecordPaymentDto {
  @IsUUID()
  invoiceId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;
}
