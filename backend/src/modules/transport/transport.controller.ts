import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TransportService } from './transport.service';

@ApiTags('transport')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transport')
export class TransportController {
  constructor(private transportService: TransportService) {}

  @Post('vehicles')
  @Roles(UserRole.SCHOOL_ADMIN)
  addVehicle(@Req() req: any, @Body() body: { registrationNo: string; capacity: number; routeName?: string; driverId?: string }) {
    return this.transportService.addVehicle(req.user.schoolId, body);
  }

  @Get('vehicles')
  @Roles(UserRole.SCHOOL_ADMIN)
  listVehicles(@Req() req: any) {
    return this.transportService.listVehicles(req.user.schoolId);
  }

  @Post('allocations')
  @Roles(UserRole.SCHOOL_ADMIN)
  allocateStudent(@Body() body: { studentId: string; vehicleId: string; pickupPoint?: string }) {
    return this.transportService.allocateStudent(body.studentId, body.vehicleId, body.pickupPoint);
  }
}
