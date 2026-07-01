import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FeesService } from './fees.service';
import { CreateInvoiceDto, RecordPaymentDto } from './dto/fees.dto';

@ApiTags('fees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fees')
export class FeesController {
  constructor(private feesService: FeesService) {}

  @Post('invoices')
  @Roles(UserRole.ACCOUNTANT, UserRole.SCHOOL_ADMIN)
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.feesService.createInvoice(dto);
  }

  @Get('invoices/student/:studentId')
  @Roles(UserRole.ACCOUNTANT, UserRole.SCHOOL_ADMIN, UserRole.PARENT, UserRole.STUDENT)
  getStudentInvoices(@Param('studentId') studentId: string) {
    return this.feesService.getStudentInvoices(studentId);
  }

  @Post('payments')
  @Roles(UserRole.ACCOUNTANT, UserRole.SCHOOL_ADMIN)
  recordPayment(@Body() dto: RecordPaymentDto) {
    return this.feesService.recordPayment(dto);
  }

  @Get('summary')
  @Roles(UserRole.ACCOUNTANT, UserRole.SCHOOL_ADMIN)
  getSummary(@Query('academicYearId') academicYearId: string) {
    return this.feesService.getCollectionSummary(academicYearId);
  }
}
