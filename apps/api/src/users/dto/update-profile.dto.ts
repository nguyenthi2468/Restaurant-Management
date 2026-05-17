import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  lastName?: string;
}
