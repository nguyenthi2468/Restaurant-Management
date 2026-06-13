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
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/attendance/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/attendance/update-attendance.dto';
import { QueryAttendanceDto } from './dto/attendance/query-attendance.dto';
import { ClockInDto } from './dto/attendance/clock-in.dto';
import { ClockOutDto } from './dto/attendance/clock-out.dto';
import { ClockInOtpDto } from './dto/attendance/clock-in-otp.dto';
import { ClockOutOtpDto } from './dto/attendance/clock-out-otp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import { Action } from '../auth/decorator/action.decorator';
import * as QRCode from 'qrcode';
import { Response } from 'express';
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
  @ApiResponse({
    status: 201,
    description: 'Bản ghi chấm công đã được tạo thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc bản ghi đã tồn tại',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }
  @Get('qdcode/:employeeId')
  async generate(
    @Param('employeeId') employeeId: string,
    @Res() res: Response,
  ) {
    const qr = await QRCode.toBuffer(employeeId);

    res.setHeader('Content-Type', 'image/png');
    res.send(qr);
  }

  @Get('generate-otp')
  @ApiOperation({ summary: 'Tạo mã OTP cho chấm công' })
  @ApiResponse({
    status: 200,
    description: 'Mã OTP đã được tạo thành công',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async generateOTP() {
    const otp = await this.attendanceService.generateOTP();
    return { otp };
  }
  @Get()
  @Action('attendance:read')
  @UseGuards(ActionGuard)
  @ApiOperation({
    summary: 'Lấy danh sách bản ghi chấm công với bộ lọc và phân trang',
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    description: 'Lọc theo ID nhân viên',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Ngày bắt đầu (ISO format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Ngày kết thúc (ISO format)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PRESENT', 'ABSENT', 'LATE', 'EARLY_LEAVE', 'ON_LEAVE'],
    description: 'Lọc theo trạng thái chấm công',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (bắt đầu từ 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng mục trên mỗi trang',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bản ghi chấm công với metadata phân trang',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@Query() query: QueryAttendanceDto) {
    return this.attendanceService.findAllWithPagination(query);
  }

  @Get('employee/:employeeId')
  @Action('attendance:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy danh sách chấm công của nhân viên' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách chấm công của nhân viên',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Bản ghi chấm công đã được cập nhật',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bản ghi chấm công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
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
  @ApiResponse({
    status: 400,
    description: 'Nhân viên đã chấm công vào hôm nay',
  })
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
  @ApiResponse({
    status: 400,
    description: 'Nhân viên chưa chấm công vào hoặc đã chấm công ra',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bản ghi chấm công vào',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  clockOut(@Body() clockOutDto: ClockOutDto) {
    return this.attendanceService.clockOut(clockOutDto);
  }

  @Post('clock-in-otp')
  @ApiOperation({ summary: 'Chấm công vào với xác thực OTP' })
  @ApiBody({ type: ClockInOtpDto })
  @ApiResponse({ status: 201, description: 'Chấm công vào thành công' })
  @ApiResponse({
    status: 400,
    description: 'Mã OTP không hợp lệ hoặc nhân viên đã chấm công vào hôm nay',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  clockInWithOtp(@Body() clockInOtpDto: ClockInOtpDto) {
    return this.attendanceService.clockInWithOtp(
      clockInOtpDto.employeeId,
      clockInOtpDto.otp,
    );
  }

  @Post('clock-out-otp')
  @ApiOperation({ summary: 'Chấm công ra với xác thực OTP' })
  @ApiBody({ type: ClockOutOtpDto })
  @ApiResponse({ status: 200, description: 'Chấm công ra thành công' })
  @ApiResponse({
    status: 400,
    description:
      'Mã OTP không hợp lệ, nhân viên chưa chấm công vào hoặc đã chấm công ra',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bản ghi chấm công vào',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  clockOutWithOtp(@Body() clockOutOtpDto: ClockOutOtpDto) {
    return this.attendanceService.clockOutWithOtp(
      clockOutOtpDto.employeeId,
      clockOutOtpDto.otp,
    );
  }
}
