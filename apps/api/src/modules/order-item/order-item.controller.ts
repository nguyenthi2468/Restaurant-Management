import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
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

@ApiTags('Order Items Management')
@ApiBearerAuth()
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  @Action('order-item:create')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Tạo mục đơn hàng mới',
    description:
      'Tạo một mục đơn hàng mới liên kết đơn hàng với món ăn và chỉ định số lượng, giá',
  })
  @ApiCreatedResponse({
    description: 'Mục đơn hàng đã được tạo thành công',
    type: CreateOrderItemDto,
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
      'Đơn hàng hoặc món ăn không tồn tại - ID được cung cấp không tìm thấy trong hệ thống',
  })
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemService.create(createOrderItemDto);
  }

  @Get()
  @Action('order-item:read')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả mục đơn hàng',
    description:
      'Lấy danh sách tất cả các mục đơn hàng trong hệ thống kèm theo thông tin đơn hàng và món ăn',
  })
  @ApiResponse({
    status: 200,
    description:
      'Danh sách tất cả các mục đơn hàng bao gồm thông tin đơn hàng và món ăn',
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  findAll() {
    return this.orderItemService.findAll();
  }

  @Get(':id')
  @Action('order-item:read')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết mục đơn hàng',
    description:
      'Lấy thông tin chi tiết của một mục đơn hàng cụ thể dựa trên ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Chi tiết mục đơn hàng bao gồm thông tin đơn hàng, món ăn, số lượng và giá',
  })
  @ApiResponse({
    status: 404,
    description:
      'Mục đơn hàng không tìm thấy - Không có mục đơn hàng nào với ID được cung cấp',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  findOne(@Param('id') id: string) {
    return this.orderItemService.findOne(id);
  }

  @Patch(':id')
  @Action('order-item:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Cập nhật mục đơn hàng',
    description:
      'Cập nhật thông tin của mục đơn hàng như số lượng, giá hoặc liên kết với đơn hàng/món ăn khác',
  })
  @ApiResponse({
    status: 200,
    description: 'Mục đơn hàng đã được cập nhật thành công',
  })
  @ApiResponse({
    status: 404,
    description:
      'Mục đơn hàng không tìm thấy - Không có mục đơn hàng nào với ID được cung cấp',
  })
  @ApiResponse({
    status: 400,
    description:
      'Dữ liệu không hợp lệ - Số lượng phải là số nguyên dương, giá phải là số không âm',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @Action('order-item:delete')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Xoá mục đơn hàng',
    description: 'Xóa vĩnh viễn một mục đơn hàng khỏi hệ thống',
  })
  @ApiResponse({
    status: 200,
    description: 'Mục đơn hàng đã được xóa thành công khỏi hệ thống',
  })
  @ApiResponse({
    status: 404,
    description:
      'Mục đơn hàng không tìm thấy - Không có mục đơn hàng nào với ID được cung cấp',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  remove(@Param('id') id: string) {
    return this.orderItemService.remove(id);
  }
}
