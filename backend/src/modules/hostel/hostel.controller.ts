import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HostelService } from './hostel.service';

@ApiTags('hostel')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('hostel')
export class HostelController {
  constructor(private hostelService: HostelService) {}

  @Post('hostels')
  @Roles(UserRole.SCHOOL_ADMIN)
  addHostel(@Req() req: any, @Body() body: { name: string; type: string }) {
    return this.hostelService.addHostel(req.user.schoolId, body);
  }

  @Post('hostels/:hostelId/rooms')
  @Roles(UserRole.SCHOOL_ADMIN)
  addRoom(@Param('hostelId') hostelId: string, @Body() body: { roomNo: string; capacity: number }) {
    return this.hostelService.addRoom(hostelId, body);
  }

  @Get('hostels')
  @Roles(UserRole.SCHOOL_ADMIN)
  listHostels(@Req() req: any) {
    return this.hostelService.listHostels(req.user.schoolId);
  }

  @Post('allocations')
  @Roles(UserRole.SCHOOL_ADMIN)
  allocateStudent(@Body() body: { studentId: string; roomId: string }) {
    return this.hostelService.allocateStudent(body.studentId, body.roomId);
  }
}
