import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { TimeOffRequestService } from './time-off-request.service';
import { CreateTimeOffRequestDto } from './dto/time-off-request/create-time-off-request.dto';
import { UpdateTimeOffRequestDto } from './dto/time-off-request/update-time-off-request.dto';
import { QueryTimeOffRequestDto } from './dto/time-off-request/query-time-off-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import { Action } from '../auth/decorator/action.decorator';

@ApiTags('employee-schedules/time-off-requests')
@ApiBearerAuth()
@Controller('employee-schedules/time-off-requests')
@UseGuards(JwtAuthGuard)
export class TimeOffRequestController {
  constructor(private readonly timeOffRequestService: TimeOffRequestService) {}

  @Post()
  @Action('time-off-request:create')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Tạo yêu cầu nghỉ phép' })
  @ApiBody({ type: CreateTimeOffRequestDto })
  @ApiResponse({ status: 201, description: 'Yêu cầu nghỉ phép đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createTimeOffRequestDto: CreateTimeOffRequestDto) {
    return this.timeOffRequestService.create(createTimeOffRequestDto);
  }

  @Get()
  @Action('time-off-request:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy danh sách yêu cầu nghỉ phép với bộ lọc' })
  @ApiResponse({ status: 200, description: 'Danh sách yêu cầu nghỉ phép' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@Query() query: QueryTimeOffRequestDto) {
    return this.timeOffRequestService.findAll(query);
  }

  @Get('employee/:employeeId')
  @Action('time-off-request:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy danh sách yêu cầu nghỉ phép của nhân viên' })
  @ApiResponse({ status: 200, description: 'Danh sách yêu cầu nghỉ phép của nhân viên' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.timeOffRequestService.findByEmployee(employeeId);
  }

  @Get(':id')
  @Action('time-off-request:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy thông tin yêu cầu nghỉ phép theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết yêu cầu nghỉ phép' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy yêu cầu nghỉ phép' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(@Param('id') id: string) {
    return this.timeOffRequestService.findOne(id);
  }

  @Patch(':id')
  @Action('time-off-request:update')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Cập nhật yêu cầu nghỉ phép' })
  @ApiBody({ type: UpdateTimeOffRequestDto })
  @ApiResponse({ status: 200, description: 'Yêu cầu nghỉ phép đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy yêu cầu nghỉ phép' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateTimeOffRequestDto: UpdateTimeOffRequestDto,
  ) {
    return this.timeOffRequestService.update(id, updateTimeOffRequestDto);
  }

  @Delete(':id')
  @Action('time-off-request:delete')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Xóa yêu cầu nghỉ phép' })
  @ApiResponse({ status: 200, description: 'Yêu cầu nghỉ phép đã được xóa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy yêu cầu nghỉ phép' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.timeOffRequestService.remove(id);
  }

  @Post(':id/approve')
  @Action('time-off-request:approve')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Phê duyệt yêu cầu nghỉ phép' })
  @ApiResponse({ status: 200, description: 'Yêu cầu nghỉ phép đã được phê duyệt' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy yêu cầu nghỉ phép' })
  @ApiResponse({ status: 400, description: 'Không thể phê duyệt yêu cầu này' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  approve(
    @Param('id') id: string,
    @Request() req: any,
    @Body('reviewNote') reviewNote?: string,
  ) {
    return this.timeOffRequestService.approve(id, req.user.id, reviewNote);
  }

  @Post(':id/reject')
  @Action('time-off-request:reject')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Từ chối yêu cầu nghỉ phép' })
  @ApiResponse({ status: 200, description: 'Yêu cầu nghỉ phép đã bị từ chối' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy yêu cầu nghỉ phép' })
  @ApiResponse({ status: 400, description: 'Không thể từ chối yêu cầu này' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  reject(
    @Param('id') id: string,
    @Request() req: any,
    @Body('reviewNote') reviewNote?: string,
  ) {
    return this.timeOffRequestService.reject(id, req.user.id, reviewNote);
  }
}
