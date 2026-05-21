import { BookingDto } from './dto/booking.dto';
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Action } from '../auth/decorator/action.decorator';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Action('booking:create')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking created',
    type: BookingDto,
  })
  @ApiBody({ type: CreateBookingDto })
  async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingDto> {
    const booking = await this.bookingService.create(createBookingDto);
    return booking as unknown as BookingDto;
  }

  @Get()
  @Action('booking:read')
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({
    status: 200,
    description: 'List of bookings',
    type: [BookingDto],
  })
  async findAll(): Promise<BookingDto[]> {
    const bookings = await this.bookingService.findAll();
    return bookings as unknown as BookingDto[];
  }

  @Get(':id')
  @Action('booking:read')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({ status: 200, description: 'Booking found', type: BookingDto })
  async findOne(@Param('id') id: string): Promise<BookingDto> {
    const booking = await this.bookingService.findOne(id);
    return booking as unknown as BookingDto;
  }

  @Patch(':id')
  @Action('booking:update')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({
    status: 200,
    description: 'Booking updated',
    type: BookingDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<BookingDto> {
    const updatedBooking = await this.bookingService.update(
      id,
      updateBookingDto,
    );
    return updatedBooking as unknown as BookingDto;
  }

  @Delete(':id')
  @Action('booking:delete')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking deleted',
    type: BookingDto,
  })
  async remove(@Param('id') id: string): Promise<BookingDto> {
    const deletedBooking = await this.bookingService.remove(id);
    return deletedBooking as unknown as BookingDto;
  }

  // ----- Deposit and status management -----

  @Post(':id/approve-deposit')
  @Action('booking:approve_deposit')
  @ApiOperation({ summary: 'Approve deposit payment manually' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Deposit approved',
    type: BookingDto,
  })
  async approveDeposit(@Param('id') id: string): Promise<BookingDto> {
    const approvedBooking = await this.bookingService.approveDeposit(id);
    return approvedBooking as unknown as BookingDto;
  }

  @Post(':id/refund-deposit')
  @Action('booking:refund_deposit')
  @ApiOperation({ summary: 'Refund deposit for a booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Deposit refunded',
    type: BookingDto,
  })
  async refundDeposit(@Param('id') id: string): Promise<BookingDto> {
    const refundedBooking = await this.bookingService.refundDeposit(id);
    return refundedBooking as unknown as BookingDto;
  }

  @Post(':id/arrive')
  @Action('booking:mark_arrived')
  @ApiOperation({ summary: 'Mark booking as arrived (confirm)' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking confirmed',
    type: BookingDto,
  })
  async markArrived(@Param('id') id: string): Promise<BookingDto> {
    const arrivedBooking = await this.bookingService.markArrived(id);
    return arrivedBooking as unknown as BookingDto;
  }

  @Post(':id/complete')
  @Action('booking:complete')
  @ApiOperation({ summary: 'Complete a booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking completed',
    type: BookingDto,
  })
  async completeBooking(@Param('id') id: string): Promise<BookingDto> {
    const completedBooking = await this.bookingService.completeBooking(id);
    return completedBooking as unknown as BookingDto;
  }

  @Post(':id/cancel')
  @Action('booking:cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled',
    type: BookingDto,
  })
  async cancelBooking(@Param('id') id: string): Promise<BookingDto> {
    const cancelledBooking = await this.bookingService.cancelBooking(id);
    return cancelledBooking as unknown as BookingDto;
  }

  // ----- VNPay payment integration -----

  @Post(':id/pay')
  @Action('booking:create_vnpay_payment')
  @ApiOperation({ summary: 'Create VNPay payment URL for deposit' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Payment URL generated',
    schema: {
      type: 'object',
      properties: { paymentUrl: { type: 'string' } },
    },
  })
  async createVnpayPayment(
    @Param('id') id: string,
  ): Promise<{ paymentUrl: string }> {
    const paymentUrl = await this.bookingService.createVnpayPayment(id);
    return { paymentUrl };
  }

  @Get('vnpay-return')
  @Action('booking:handle_vnpay_return')
  @ApiOperation({ summary: 'Handle VNPay return callback' })
  @ApiResponse({
    status: 200,
    description: 'Booking updated',
    type: BookingDto,
  })
  async handleVnpayReturn(@Query() query: any): Promise<BookingDto> {
    const booking = await this.bookingService.handleVnpayReturn(query);
    return booking as unknown as BookingDto;
  }
}
