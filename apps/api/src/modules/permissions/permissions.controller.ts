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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { MANAGE_USER } from '../permissions/permissions.constant';
import { Action } from '../auth/decorator/action.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo quyền mới' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiCreatedResponse({ description: 'Quyền đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreatePermissionDto) {
    return this.service.create(dto);
  }

  @Get()
  @Action('permissions.list')
  @ApiOperation({ summary: 'Lấy danh sách quyền với bộ lọc và phân trang' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách quyền',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(q?: { search?: string; skip?: number; take?: number }) {
  return this.service.listPermissions({
    q: q?.search,
    offset: q?.skip ?? 0,
    limit: q?.take ?? 50,
  });
}

  @Get(':id')
  @ApiOperation({ summary: 'Lấy quyền theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết quyền',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật quyền' })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({
    status: 200,
    description: 'Đã cập nhật quyền',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa quyền' })
  @ApiResponse({
    status: 200,
    description: 'Đã xóa quyền',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}