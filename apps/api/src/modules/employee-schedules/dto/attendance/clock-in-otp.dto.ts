import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClockInOtpDto {
  @ApiProperty({ description: 'ID nhân viên' })
  @IsString()
  employeeId!: string;

  @ApiProperty({ description: 'Mã OTP để xác thực' })
  @IsString()
  otp!: string;
}
