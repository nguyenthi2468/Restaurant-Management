import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiProperty({ example: ['perm1', 'perm2'], description: 'List of permission IDs to assign' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  permissionIds: string[];
}
