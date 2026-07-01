import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(schoolId: string, email: string, password: string, role: UserRole) {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { schoolId, email, passwordHash, role },
    });
  }

  findBySchool(schoolId: string) {
    return this.prisma.user.findMany({
      where: { schoolId },
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    });
  }
}
