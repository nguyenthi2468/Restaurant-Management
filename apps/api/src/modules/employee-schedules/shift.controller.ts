import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/shift/create-shift.dto';
import { UpdateShiftDto } from './dto/shift/update-shift.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import { Action } from '../auth/decorator/action.decorator';

@ApiTags('employee-schedules/shifts')
@ApiBearerAuth()
@Controller('employee-schedules/shifts')
@UseGuards(JwtAuthGuard)
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @Action('shift:create')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Tạo ca làm việc mới' })
  @ApiBody({ type: CreateShiftDto })
  @ApiResponse({ status: 201, description: 'Ca làm việc đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftService.create(createShiftDto);
  }

  @Get()
  @Action('shift:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy danh sách tất cả ca làm việc' })
  @ApiResponse({ status: 200, description: 'Danh sách ca làm việc' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.shiftService.findAll();
  }

  @Get('active')
  @Action('shift:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy danh sách ca làm việc đang hoạt động' })
  @ApiResponse({ status: 200, description: 'Danh sách ca làm việc đang hoạt động' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findActive() {
    return this.shiftService.findActive();
  }

  @Get(':id')
  @Action('shift:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy thông tin ca làm việc theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết ca làm việc' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ca làm việc' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(@Param('id') id: string) {
    return this.shiftService.findOne(id);
  }

  @Patch(':id')
  @Action('shift:update')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Cập nhật ca làm việc' })
  @ApiBody({ type: UpdateShiftDto })
  @ApiResponse({ status: 200, description: 'Ca làm việc đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ca làm việc' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftService.update(id, updateShiftDto);
  }

  @Delete(':id')
  @Action('shift:delete')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Xóa ca làm việc' })
  @ApiResponse({ status: 200, description: 'Ca làm việc đã được xóa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy ca làm việc' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.shiftService.remove(id);
  }
}
