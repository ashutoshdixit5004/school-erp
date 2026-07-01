import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AcademicModule } from './modules/academic/academic.module';
import { StudentsModule } from './modules/students/students.module';
import { AdmissionsModule } from './modules/admissions/admissions.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { FeesModule } from './modules/fees/fees.module';
import { ExamsModule } from './modules/exams/exams.module';
import { StaffModule } from './modules/staff/staff.module';
import { LibraryModule } from './modules/library/library.module';
import { TransportModule } from './modules/transport/transport.module';
import { HostelModule } from './modules/hostel/hostel.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AcademicModule,
    StudentsModule,
    AdmissionsModule,
    AttendanceModule,
    FeesModule,
    ExamsModule,
    StaffModule,
    LibraryModule,
    TransportModule,
    HostelModule,
  ],
})
export class AppModule {}
