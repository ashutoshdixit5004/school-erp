import { StaffType } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  employeeCode: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(StaffType)
  staffType: StaffType;

  @IsString()
  designation: string;

  @IsDateString()
  dateOfJoining: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class RunPayrollDto {
  @IsString()
  staffId: string;

  @IsNumber()
  @Min(1)
  month: number;

  @IsNumber()
  year: number;

  @IsNumber()
  @Min(0)
  basicSalary: number;

  @IsOptional()
  @IsNumber()
  allowances?: number;

  @IsOptional()
  @IsNumber()
  deductions?: number;
}
