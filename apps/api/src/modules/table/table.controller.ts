import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TableService } from './table.service';
import { TableStatus } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('table')
@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bàn mới' })
  create(@Body() createTableDto: { number: number; capacity: number }) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả bàn' })
  findAll() {
    return this.tableService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin bàn theo ID' })
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin bàn' })
  update(
    @Param('id') id: string,
    @Body() updateTableDto: { capacity?: number; status?: TableStatus },
  ) {
    return this.tableService.update(id, updateTableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bàn' })
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }
}
