import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ShiftType } from '@prisma/client';

export class CreateShiftDto {
  @IsString()
  name!: string;

  @IsEnum(ShiftType)
  type!: ShiftType;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
