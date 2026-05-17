import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Role name (e.g., admin, waiter, chef)' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'System administrator', description: 'Role description' })
  @IsOptional()
  @IsString()
  description?: string;
}
