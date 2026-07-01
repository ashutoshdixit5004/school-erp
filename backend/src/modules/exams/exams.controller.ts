import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ExamsService } from './exams.service';
import { RecordResultDto } from './dto/exams.dto';

@ApiTags('exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exams')
export class ExamsController {
  constructor(private examsService: ExamsService) {}

  @Post('results')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  recordResult(@Body() dto: RecordResultDto) {
    return this.examsService.recordResult(dto);
  }

  @Get('report-card/:studentId/:examTermId')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.PARENT, UserRole.STUDENT)
  getReportCard(@Param('studentId') studentId: string, @Param('examTermId') examTermId: string) {
    return this.examsService.getReportCard(studentId, examTermId);
  }
}
