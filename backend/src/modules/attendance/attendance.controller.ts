import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/attendance.dto';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  mark(@Req() req: any, @Body() dto: MarkAttendanceDto) {
    return this.attendanceService.markAttendance(req.user.userId, dto);
  }

  @Get('section/:sectionId')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  getBySection(@Param('sectionId') sectionId: string, @Query('date') date: string) {
    return this.attendanceService.getBySection(sectionId, date);
  }

  @Get('student/:studentId/summary')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.PARENT, UserRole.STUDENT)
  getStudentSummary(@Param('studentId') studentId: string) {
    return this.attendanceService.getStudentSummary(studentId);
  }
}
