import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'abcdef123456', description: 'Token từ email xác thực' })
  @IsString()
  token: string;
}