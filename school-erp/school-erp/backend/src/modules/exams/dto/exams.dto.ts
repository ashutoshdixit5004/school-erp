import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class RecordResultDto {
  @IsUUID()
  examSubjectId: string;

  @IsUUID()
  studentId: string;

  @IsNumber()
  @Min(0)
  marksObtained: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
