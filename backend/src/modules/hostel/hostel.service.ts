import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class HostelService {
  constructor(private prisma: PrismaService) {}

  addHostel(schoolId: string, data: { name: string; type: string }) {
    return this.prisma.hostel.create({ data: { ...data, schoolId } });
  }

  addRoom(hostelId: string, data: { roomNo: string; capacity: number }) {
    return this.prisma.hostelRoom.create({ data: { ...data, hostelId } });
  }

  listHostels(schoolId: string) {
    return this.prisma.hostel.findMany({
      where: { schoolId },
      include: { rooms: { include: { allocations: true } } },
    });
  }

  async allocateStudent(studentId: string, roomId: string) {
    const room = await this.prisma.hostelRoom.findUnique({
      where: { id: roomId },
      include: { allocations: true },
    });
    if (!room) throw new NotFoundException('Room not found');
    if (room.allocations.length >= room.capacity) {
      throw new BadRequestException('Room is at full capacity');
    }

    return this.prisma.hostelAllocation.upsert({
      where: { studentId },
      update: { roomId },
      create: { studentId, roomId },
    });
  }
}
