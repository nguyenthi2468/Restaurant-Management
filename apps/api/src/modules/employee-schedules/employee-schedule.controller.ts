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
import { EmployeeScheduleService } from './employee-schedule.service';
import { CreateEmployeeScheduleDto } from './dto/employee-schedule/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/employee-schedule/update-employee-schedule.dto';
import { QueryEmployeeScheduleDto } from './dto/employee-schedule/query-employee-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import { Action } from '../auth/decorator/action.decorator';

@ApiTags('employee-schedules/schedules')
@ApiBearerAuth()
@Controller('employee-schedules/schedules')
@UseGuards(JwtAuthGuard)
export class EmployeeScheduleController {
  constructor(private readonly employeeScheduleService: EmployeeScheduleService) {}

  @Post()
  @Action('employee-schedule:create')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Phân ca làm việc cho nhân viên' })
  @ApiBody({ type: CreateEmployeeScheduleDto })
  @ApiResponse({ status: 201, description: 'Lịch làm việc đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhân viên hoặc ca làm việc' })
  @ApiResponse({ status: 409, description: 'Nhân viên đã được phân ca này' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createEmployeeScheduleDto: CreateEmployeeScheduleDto) {
    return this.employeeScheduleService.create(createEmployeeScheduleDto);
  }

  @Get()
  @Action('employee-schedule:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy danh sách lịch làm việc với bộ lọc' })
  @ApiResponse({ status: 200, description: 'Danh sách lịch làm việc' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@Query() query: QueryEmployeeScheduleDto) {
    return this.employeeScheduleService.findAll(query);
  }

  @Get('employee/:employeeId')
  @Action('employee-schedule:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy lịch làm việc của nhân viên' })
  @ApiResponse({ status: 200, description: 'Lịch làm việc của nhân viên' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByEmployee(
    @Param('employeeId') employeeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.employeeScheduleService.findByEmployee(
      employeeId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  @Action('employee-schedule:read')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Lấy thông tin lịch làm việc theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết lịch làm việc' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch làm việc' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(@Param('id') id: string) {
    return this.employeeScheduleService.findOne(id);
  }

  @Patch(':id')
  @Action('employee-schedule:update')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Cập nhật lịch làm việc' })
  @ApiBody({ type: UpdateEmployeeScheduleDto })
  @ApiResponse({ status: 200, description: 'Lịch làm việc đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch làm việc' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeScheduleDto: UpdateEmployeeScheduleDto,
  ) {
    return this.employeeScheduleService.update(id, updateEmployeeScheduleDto);
  }

  @Delete(':id')
  @Action('employee-schedule:delete')
  @UseGuards(ActionGuard)
  @ApiOperation({ summary: 'Xóa lịch làm việc' })
  @ApiResponse({ status: 200, description: 'Lịch làm việc đã được xóa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch làm việc' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string) {
    return this.employeeScheduleService.remove(id);
  }
}
