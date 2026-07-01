import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  addVehicle(schoolId: string, data: { registrationNo: string; capacity: number; routeName?: string; driverId?: string }) {
    return this.prisma.vehicle.create({ data: { ...data, schoolId } });
  }

  listVehicles(schoolId: string) {
    return this.prisma.vehicle.findMany({ where: { schoolId }, include: { driver: true, allocations: true } });
  }

  allocateStudent(studentId: string, vehicleId: string, pickupPoint?: string) {
    return this.prisma.transportAllocation.upsert({
      where: { studentId },
      update: { vehicleId, pickupPoint },
      create: { studentId, vehicleId, pickupPoint },
    });
  }
}
