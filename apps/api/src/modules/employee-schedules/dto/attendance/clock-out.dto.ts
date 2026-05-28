import { Type } from 'class-transformer';
import { IsString, IsDate } from 'class-validator';

export class ClockOutDto {
  @IsString()
  employeeId!: string;  
}
