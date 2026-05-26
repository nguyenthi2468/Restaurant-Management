import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderNoteDto } from './dto/update-order-note.dto';
import { CompleteOrderDto } from './dto/complete-order.dto';
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
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.orderService.create(createOrderDto, userId);
  }

  @Get()
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
  @ApiOperation({
    summary: 'Lấy chi tiết đơn hàng theo ID',
    description:
      'Lấy thông tin chi tiết của một đơn hàng bao gồm món ăn, bàn và thanh toán',
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
  findOne(@Param('id') id: number) {
    return this.orderService.findOne(id);
  }

  @Get('table/:tableId/served')
  @ApiOperation({
    summary: 'Lấy chi tiết đơn hàng SERVED theo ID bàn',
    description:
      'Lấy thông tin chi tiết đơn hàng có trạng thái SERVED liên kết với một bàn cụ thể',
  })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết đơn hàng SERVED',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đơn hàng với bàn được cung cấp',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  findServedOrderByTableId(@Param('tableId') tableId: string) {
    return this.orderService.findServedOrderByTableId(tableId);
  }

  @Patch(':id/cancel')
  @Action('order:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Hủy đơn hàng',
    description: 'Hủy đơn hàng bằng cách cập nhật trạng thái thành CANCELLED',
  })
  @ApiResponse({
    status: 200,
    description: 'Đơn hàng đã được hủy thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đơn hàng với ID được cung cấp',
  })
  @ApiResponse({
    status: 400,
    description: 'Đơn hàng đã ở trạng thái không thể hủy',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  cancel(@Param('id') id: number) {
    return this.orderService.cancel(id);
  }

  @Patch(':id/note')
  @Action('order:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Cập nhật ghi chú đơn hàng',
    description: 'Chỉ cập nhật ghi chú cho đơn hàng',
  })
  @ApiResponse({
    status: 200,
    description: 'Ghi chú đơn hàng đã được cập nhật thành công',
    type: UpdateOrderNoteDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đơn hàng với ID được cung cấp',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  updateNote(
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateOrderNoteDto,
  ) {
    return this.orderService.updateNote(id, updateNoteDto.note);
  }

  @Patch(':id/complete')
  @Action('order:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({
    summary: 'Hoàn thành đơn hàng',
    description:
      'Hoàn thành đơn hàng bằng cách cập nhật trạng thái thành COMPLETED và tạo payment',
  })
  @ApiResponse({
    status: 200,
    description: 'Đơn hàng đã được hoàn thành thành công',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đơn hàng với ID được cung cấp',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token xác thực không hợp lệ hoặc отсутствует',
  })
  completeOrder(
    @Param('id') id: number,
    @Body() completeOrderDto: CompleteOrderDto,
  ) {
    return this.orderService.completeOrder(id, completeOrderDto);
  }
}
