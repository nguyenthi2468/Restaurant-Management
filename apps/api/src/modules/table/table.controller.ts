import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query, // Keep Query for findAll functionality
  UseGuards, // Keep UseGuards for auth
} from '@nestjs/common';
import { TableService } from './table.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiQuery, // Keep ApiQuery for findAll functionality
} from '@nestjs/swagger';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Action } from '../auth/decorator/action.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import { TableStatus } from '@prisma/client'; // Import TableStatus for ApiQuery enum

@ApiTags('Tables Management')
@ApiBearerAuth()
@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @Action('table:create')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Tạo bàn mới',
    description:
      'Tạo một bàn mới với tên, tầng, khu vực (NORMAL/VIP) và số ghế', // Merged description from HEAD
  })
  @ApiCreatedResponse({
    description: 'Bàn đã được tạo thành công',
    type: CreateTableDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' }) // From HEAD
  @ApiResponse({ status: 401, description: 'Unauthorized' }) // From HEAD
  @ApiResponse({ status: 409, description: 'Tên bàn đã tồn tại' }) // From HEAD
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  @Action('table:read')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả bàn',
    description:
      'Lấy danh sách tất cả các bàn, có thể tìm kiếm theo tên, tầng và lọc theo trạng thái', // Merged description from HEAD
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Tìm kiếm theo tên bàn (tìm kiếm gần đúng)',
  })
  @ApiQuery({
    name: 'floor',
    required: false,
    description: 'Tìm kiếm theo tầng (tìm kiếm gần đúng)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TableStatus,
    description: 'Lọc bàn theo trạng thái',
  })
  @ApiResponse({ status: 200, description: 'Danh sách bàn', isArray: true }) // From HEAD
  @ApiResponse({ status: 401, description: 'Unauthorized' }) // From HEAD
  findAll(
    @Query('name') name?: string,
    @Query('floor') floor?: string,
    @Query('status') status?: TableStatus,
  ) {
    // Nếu có name hoặc floor hoặc status, sử dụng search
    if (name || floor || status) {
      return this.tableService.search({ name, floor, status });
    }
    return this.tableService.findAll();
  }

  @Get(':id')
  @Action('table:read')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Lấy thông tin bàn theo ID',
    description: 'Lấy thông tin chi tiết của một bàn cụ thể dựa trên ID',
  })
  @ApiResponse({ status: 200, description: 'Chi tiết bàn' }) // From HEAD
  @ApiResponse({ status: 404, description: 'Không tìm thấy bàn' }) // From HEAD
  @ApiResponse({ status: 401, description: 'Unauthorized' }) // From HEAD
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(id);
  }

  @Patch(':id')
  @Action('table:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Cập nhật thông tin bàn',
    description: 'Cập nhật tên, tầng, khu vực, số ghế hoặc trạng thái của bàn', // Merged description from HEAD
  })
  @ApiResponse({ status: 200, description: 'Bàn đã được cập nhật thành công' }) // From HEAD
  @ApiResponse({ status: 404, description: 'Không tìm thấy bàn' }) // From HEAD
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' }) // From HEAD
  @ApiResponse({ status: 401, description: 'Unauthorized' }) // From HEAD
  @ApiResponse({ status: 409, description: 'Tên bàn đã tồn tại' }) // From HEAD
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.update(id, updateTableDto);
  }

  @Delete(':id')
  @Action('table:delete')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Xóa bàn',
    description: 'Xóa vĩnh viễn một bàn khỏi hệ thống (hard delete)', // Merged description from HEAD
  })
  @ApiResponse({
    status: 200,
    description: 'Bàn đã được xóa thành công khỏi hệ thống',
  }) // From HEAD
  @ApiResponse({
    status: 404,
    description: 'Bàn không tìm thấy - Không có bàn nào với ID được cung cấp',
  }) // From HEAD
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  }) // From HEAD
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }
}
