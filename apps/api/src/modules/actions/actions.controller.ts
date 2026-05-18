import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { UpsertActionDto } from './dto/upsert-action.dto';
import { SetActionPermissionsDto } from './dto/set-action-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { Action } from '../auth/decorator/action.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('actions')
@ApiBearerAuth()
@Controller('actions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ActionsController {
  constructor(private readonly service: ActionsService) {}

  @Post('upsert')
  @ApiOperation({ summary: 'Tạo mới hoặc cập nhật action' })
  @ApiBody({ type: UpsertActionDto })
  @ApiCreatedResponse({ description: 'Action đã được tạo hoặc cập nhật' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  upsert(@Body() dto: UpsertActionDto) {
    return this.service.upsert(dto);
  }

  @Get()
  @Action('actions.list')
  @ApiOperation({ summary: 'Lấy danh sách tất cả actions' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách actions',
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  list() {
    return this.service.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Lấy action theo key' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết action',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy action' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  get(@Param('key') key: string) {
    return this.service.findOneByKey(key);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Cập nhật quyền cho action' })
  @ApiBody({ type: SetActionPermissionsDto })
  @ApiResponse({
    status: 200,
    description: 'Đã cập nhật quyền cho action',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy action' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  setPerms(@Param('id') id: string, @Body() dto: SetActionPermissionsDto) {
    return this.service.setActionPermissions(id, dto.permissionIds);
  }
}
