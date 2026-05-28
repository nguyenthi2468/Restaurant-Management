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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/attendance/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/attendance/update-attendance.dto';
import { QueryAttendanceDto } from './dto/attendance/query-attendance.dto';
import { ClockInDto } from './dto/attendance/clock-in.dto';
import { ClockOutDto } from './dto/attendance/clock-out.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import { Action } from '../auth/decorator/action.decorator';

@ApiTags('employee-schedules/attendance')
@ApiBearerAuth()
@Controller('employee-schedules/attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Action('attendance:create')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Tạo bản ghi chấm công' })
  @ApiBody({ type: CreateAttendanceDto })
  @ApiResponse({ status: 201, description: 'Bản ghi chấm công đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc bản ghi đã tồn tại' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @Action('attendance:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy danh sách bản ghi chấm công với bộ lọc' })
  @ApiResponse({ status: 200, description: 'Danh sách bản ghi chấm công' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@Query() query: QueryAttendanceDto) {
    return this.attendanceService.findAll(query);
  }

  @Get('employee/:employeeId')
  @Action('attendance:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy danh sách chấm công của nhân viên' })
  @ApiResponse({ status: 200, description: 'Danh sách chấm công của nhân viên' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByEmployee(
    @Param('employeeId') employeeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findByEmployee(
      employeeId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  @Action('attendance:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy thông tin bản ghi chấm công theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết bản ghi chấm công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bản ghi chấm công' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @Action('attendance:update')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Cập nhật bản ghi chấm công' })
  @ApiBody({ type: UpdateAttendanceDto })
  @ApiResponse({ status: 200, description: 'Bản ghi chấm công đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bản ghi chấm công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @Action('attendance:delete')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Xóa bản ghi chấm công' })
  @ApiResponse({ status: 200, description: 'Bản ghi chấm công đã được xóa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bản ghi chấm công' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }

  @Post('clock-in')
  @Action('attendance:clock-in')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Chấm công vào' })
  @ApiBody({ type: ClockInDto })
  @ApiResponse({ status: 201, description: 'Chấm công vào thành công' })
  @ApiResponse({ status: 400, description: 'Nhân viên đã chấm công vào hôm nay' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  clockIn(@Body() clockInDto: ClockInDto) {
    return this.attendanceService.clockIn(clockInDto);
  }

  @Post('clock-out')
  @Action('attendance:clock-out')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Chấm công ra' })
  @ApiBody({ type: ClockOutDto })
  @ApiResponse({ status: 200, description: 'Chấm công ra thành công' })
  @ApiResponse({ status: 400, description: 'Nhân viên chưa chấm công vào hoặc đã chấm công ra' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bản ghi chấm công vào' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  clockOut(@Body() clockOutDto: ClockOutDto) {
    return this.attendanceService.clockOut(clockOutDto);
  }
}
