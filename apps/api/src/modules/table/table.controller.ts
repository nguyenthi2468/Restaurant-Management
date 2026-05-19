import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TableService } from './table.service';
import { TableStatus } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiProperty,
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
    description: 'Tạo một bàn mới trong hệ thống với số bàn và sức chứa được chỉ định'
  })
  @ApiCreatedResponse({
    description: 'Bàn đã được tạo thành công',
    type: CreateTableDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ - Số bàn hoặc sức chứa không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует' })
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lấy danh sách tất cả bàn',
    description: 'Lấy danh sách tất cả các bàn trong hệ thống kèm theo trạng thái hiện tại'
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tất cả các bàn',
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует' })
  findAll() {
    return this.tableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Lấy thông tin bàn theo ID',
    description: 'Lấy thông tin chi tiết của một bàn cụ thể dựa trên ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết thông tin bàn bao gồm số bàn, sức chứa và trạng thái',
  })
  @ApiResponse({ status: 404, description: 'Bàn không tìm thấy - Không có bàn nào với ID được cung cấp' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует' })
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Cập nhật thông tin bàn',
    description: 'Cập nhật thông tin của bàn như sức chứa hoặc trạng thái'
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin bàn đã được cập nhật thành công',
  })
  @ApiResponse({ status: 404, description: 'Bàn không tìm thấy - Không có bàn nào với ID được cung cấp' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ - Sức chứa phải là số nguyên dương' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует' })
  update(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.tableService.update(id, updateTableDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Xóa bàn',
    description: 'Xóa vĩnh viễn một bàn khỏi hệ thống (hard delete)'
  })
  @ApiResponse({
    status: 200,
    description: 'Bàn đã được xóa thành công khỏi hệ thống',
  })
  @ApiResponse({ status: 404, description: 'Bàn không tìm thấy - Không có bàn nào với ID được cung cấp' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует' })
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }
}
