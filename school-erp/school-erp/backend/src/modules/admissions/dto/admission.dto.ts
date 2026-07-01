import { Gender } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAdmissionApplicationDto {
  @IsUUID()
  academicYearId: string;

  @IsUUID()
  applyingClassId: string;

  @IsString()
  applicantName: string;

  @IsDateString()
  dob: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  guardianName: string;

  @IsString()
  guardianPhone: string;

  @IsOptional()
  @IsEmail()
  guardianEmail?: string;
}

export class DecideAdmissionApplicationDto {
  @IsEnum(['APPROVED', 'REJECTED', 'WAITLISTED'])
  status: 'APPROVED' | 'REJECTED' | 'WAITLISTED';

  @IsOptional()
  @IsUUID()
  sectionId?: string; // required when approving, to assign the new student to a section
}
