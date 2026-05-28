import { Type } from 'class-transformer';
import { IsString, IsDate } from 'class-validator';

export class ClockInDto {
  @IsString()
  employeeId!: string;

  @IsDate()
  @Type(() => Date)
  clockInTime!: Date;
}
