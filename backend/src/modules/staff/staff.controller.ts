import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { StaffService } from './staff.service';
import { CreateStaffDto, RunPayrollDto } from './dto/staff.dto';

@ApiTags('staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post()
  @Roles(UserRole.HR, UserRole.SCHOOL_ADMIN)
  create(@Req() req: any, @Body() dto: CreateStaffDto) {
    return this.staffService.create(req.user.schoolId, dto);
  }

  @Get()
  @Roles(UserRole.HR, UserRole.SCHOOL_ADMIN)
  findAll(@Req() req: any) {
    return this.staffService.findAll(req.user.schoolId);
  }

  @Get(':id')
  @Roles(UserRole.HR, UserRole.SCHOOL_ADMIN)
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Post('payroll/run')
  @Roles(UserRole.HR, UserRole.ACCOUNTANT, UserRole.SCHOOL_ADMIN)
  runPayroll(@Body() dto: RunPayrollDto) {
    return this.staffService.runPayroll(dto);
  }

  @Patch('payroll/:id/mark-paid')
  @Roles(UserRole.ACCOUNTANT, UserRole.SCHOOL_ADMIN)
  markPaid(@Param('id') id: string) {
    return this.staffService.markPaid(id);
  }
}
