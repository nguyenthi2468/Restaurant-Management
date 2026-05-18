import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRolesToUserDto } from './dto/assign-roles-to-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Action } from '../auth/decorator/action.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo vai trò mới' })
  @ApiBody({ type: CreateRoleDto })
  @ApiCreatedResponse({ description: 'Vai trò đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateRoleDto) {
    return this.service.create(dto);
  }

  @Get()
  @Action('roles.list')
  @ApiOperation({ summary: 'Lấy danh sách vai trò với bộ lọc và phân trang' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách vai trò',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.service.findAll({
      search,
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy vai trò theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết vai trò',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật vai trò' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Đã cập nhật vai trò',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa vai trò' })
  @ApiResponse({
    status: 200,
    description: 'Đã xóa vai trò',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Gán quyền cho vai trò' })
  @ApiBody({ type: AssignPermissionsDto })
  @ApiResponse({
    status: 200,
    description: 'Đã gán quyền cho vai trò',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setRolePermissions(
    @Param('id') roleId: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.service.setRolePermissions(roleId, dto);
  }

  @Post('/assign-to-user')
  @ApiOperation({ summary: 'Gán vai trò cho người dùng' })
  @ApiBody({ type: AssignRolesToUserDto })
  @ApiResponse({
    status: 200,
    description: 'Đã gán vai trò cho người dùng',
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setUserRoles(@Body() dto: AssignRolesToUserDto) {
    return this.service.setUserRoles(dto);
  }
}
