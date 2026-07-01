import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AcademicService } from './academic.service';

@ApiTags('academic')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic')
export class AcademicController {
  constructor(private academicService: AcademicService) {}

  @Post('schools')
  @Roles(UserRole.SUPER_ADMIN)
  createSchool(@Body() body: { name: string; address?: string; phone?: string; email?: string }) {
    return this.academicService.createSchool(body);
  }

  @Post('schools/:schoolId/years')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  createAcademicYear(
    @Param('schoolId') schoolId: string,
    @Body() body: { name: string; startDate: string; endDate: string; isCurrent?: boolean },
  ) {
    return this.academicService.createAcademicYear(schoolId, body);
  }

  @Post('years/:academicYearId/classes')
  @Roles(UserRole.SCHOOL_ADMIN)
  createClass(@Param('academicYearId') academicYearId: string, @Body() body: { name: string; numericLevel: number }) {
    return this.academicService.createClass(academicYearId, body);
  }

  @Post('classes/:classId/sections')
  @Roles(UserRole.SCHOOL_ADMIN)
  createSection(@Param('classId') classId: string, @Body() body: { name: string; capacity?: number }) {
    return this.academicService.createSection(classId, body);
  }

  @Post('schools/:schoolId/subjects')
  @Roles(UserRole.SCHOOL_ADMIN)
  createSubject(@Param('schoolId') schoolId: string, @Body() body: { name: string; code?: string }) {
    return this.academicService.createSubject(schoolId, body);
  }

  @Post('classes/:classId/subjects/:subjectId')
  @Roles(UserRole.SCHOOL_ADMIN)
  linkSubject(@Param('classId') classId: string, @Param('subjectId') subjectId: string) {
    return this.academicService.linkSubjectToClass(classId, subjectId);
  }

  @Get('years/:academicYearId/classes')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  getClasses(@Param('academicYearId') academicYearId: string) {
    return this.academicService.getClassesForYear(academicYearId);
  }
}
