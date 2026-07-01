import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionApplicationDto, DecideAdmissionApplicationDto } from './dto/admission.dto';

@ApiTags('admissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admissions')
export class AdmissionsController {
  constructor(private admissionsService: AdmissionsService) {}

  @Post()
  create(@Body() dto: CreateAdmissionApplicationDto) {
    // Public-facing intake form could bypass auth in a real deployment;
    // left guarded here since this scaffold assumes staff-entered applications too.
    return this.admissionsService.create(dto);
  }

  @Get()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  findAll(@Query('status') status?: string) {
    return this.admissionsService.findAll(status);
  }

  @Get(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.admissionsService.findOne(id);
  }

  @Patch(':id/decide')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  decide(@Param('id') id: string, @Body() dto: DecideAdmissionApplicationDto) {
    return this.admissionsService.decide(id, dto);
  }
}
