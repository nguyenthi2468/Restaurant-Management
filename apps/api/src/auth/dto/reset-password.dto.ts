import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'abcdef123456', description: 'Token từ email quên mật khẩu' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewPass123!', description: 'Mật khẩu mới (tối thiểu 8 ký tự)' })
  @IsString()
  @MinLength(8)
  password: string;
}