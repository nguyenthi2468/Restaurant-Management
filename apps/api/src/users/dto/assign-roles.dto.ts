import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRolesDto {
  @ApiProperty({ example: 'user123', description: 'User ID to assign roles to' })
  @IsString()
  userId: string;

  @ApiProperty({ example: ['role1', 'role2'], description: 'List of role IDs to assign' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  roleIds: string[];
}
