import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('order')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn hàng' })
  findAll() {
    return this.orderService.findAll();
  }
}
