import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TableService } from './table.service';
import { TableStatus } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@ApiTags('tables')
@ApiBearerAuth()
@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo bàn mới',
    description:
      'Tạo một bàn mới với tên, tầng, khu vực (NORMAL/VIP) và số ghế',
  })
  @ApiCreatedResponse({
    description: 'Bàn đã được tạo thành công',
    type: CreateTableDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Tên bàn đã tồn tại' })
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả bàn',
    description:
      'Lấy danh sách tất cả các bàn, có thể tìm kiếm theo tên, tầng và lọc theo trạng thái',
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
  @ApiResponse({ status: 200, description: 'Danh sách bàn', isArray: true })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({
    summary: 'Lấy thông tin bàn theo ID',
    description: 'Lấy thông tin chi tiết của một bàn cụ thể dựa trên ID',
  })
  @ApiResponse({ status: 200, description: 'Chi tiết bàn' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bàn' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thông tin bàn',
    description: 'Cập nhật tên, tầng, khu vực, số ghế hoặc trạng thái của bàn',
  })
  @ApiResponse({ status: 200, description: 'Bàn đã được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bàn' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Tên bàn đã tồn tại' })
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.update(id, updateTableDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa bàn',
    description: 'Xóa vĩnh viễn một bàn khỏi hệ thống',
  })
  @ApiResponse({ status: 200, description: 'Bàn đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bàn' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }
}
