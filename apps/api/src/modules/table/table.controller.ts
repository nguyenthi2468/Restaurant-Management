import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TableService } from './table.service';
import { TableStatus } from '@prisma/client';

@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  create(@Body() createTableDto: { number: number; capacity: number }) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  findAll() {
    return this.tableService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTableDto: { capacity?: number; status?: TableStatus },
  ) {
    return this.tableService.update(id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }
}