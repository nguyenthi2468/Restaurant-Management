import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Action } from '../auth/decorator/action.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Orders Management')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Action('order:create')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Tạo đơn hàng mới',
    description:
      'Tạo một đơn hàng mới liên kết với một bàn và danh sách món ăn',
  })
  @ApiCreatedResponse({
    description: 'Đơn hàng đã được tạo thành công với trạng thái PENDING',
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Dữ liệu không hợp lệ - Thiếu thông tin bắt buộc hoặc giá trị không hợp lệ',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  @ApiResponse({
    status: 404,
    description:
      'Bàn không tồn tại - ID bàn được cung cấp không tìm thấy trong hệ thống',
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @Action('order:read')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả đơn hàng',
    description:
      'Lấy danh sách tất cả các đơn hàng trong hệ thống kèm theo chi tiết món ăn và bàn',
  })
  @ApiResponse({
    status: 200,
    description:
      'Danh sách tất cả các đơn hàng bao gồm thông tin bàn và chi tiết món ăn',
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @Action('order:read')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết đơn hàng theo ID',
    description: 'Lấy thông tin chi tiết của một đơn hàng bao gồm món ăn, bàn và thanh toán',
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết đơn hàng',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đơn hàng với ID được cung cấp',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
