import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRolesDto } from '../users/dto/assign-roles.dto';
import { RequiresAction } from '../common/decorators/requires-action.decorator';
import { UsersService } from '../users/users.service';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  @RequiresAction('roles.manage')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Post('assign-to-user')
  assignToUser(@Body() dto: AssignRolesDto) {
    return this.usersService.assignRoles(dto.userId, dto.roleIds);
  }

  @Post(':id/permissions')
  assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.assignPermissions(id, dto);
  }
}
