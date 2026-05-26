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
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
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
import { QueryBookingDto } from './dto/query-booking.dto';
import { QueryBookingByTableDto } from './dto/query-booking-by-table.dto';
import { PaginatedBookingResponseDto } from './dto/paginated-booking-response.dto';
import { Action } from '../auth/decorator/action.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('vnpay-return')
  @Action('booking:handle_vnpay_return')
  @ApiOperation({ summary: 'Handle VNPay return callback' })
  @ApiResponse({
    status: 200,
    description: 'Booking updated',
    type: BookingDto,
  })
  async handleVnpayReturn(
    @Query() query: any,
    @Res() res: Response,
  ): Promise<void> {
    const booking = await this.bookingService.handleVnpayReturn(query);
    const status = booking.responseCode === '00' ? 'success' : 'failed';

    const feUrl = process.env.PUBLIC_WEB_URL ?? 'http://localhost:3000';

    return res.redirect(
      `${feUrl}/reservation/payment-result?payment_status=${status}` +
        `&booking_id=${booking.bookingId ?? ''}`,
    );
  }

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
  @Action('reservation:read')
  @ApiOperation({ summary: 'Get all bookings with search and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of bookings',
    type: PaginatedBookingResponseDto,
  })
  async findAll(
    @Query() queryDto: QueryBookingDto,
  ): Promise<PaginatedBookingResponseDto> {
    return this.bookingService.findAllWithPagination(queryDto);
  }

  @Get(':id')
  @Action('reservation:read')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({ status: 200, description: 'Booking found', type: BookingDto })
  async findOne(@Param('id') id: string): Promise<BookingDto> {
    const booking = await this.bookingService.findOne(id);
    return booking as unknown as BookingDto;
  }

  @Patch(':id')
  @Action('reservation:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
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
  @Action('reservation:delete')
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
  @Action('reservation:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
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
  @Action('reservation:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
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
  @Action('reservation:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({ summary: 'Mark booking as arrived (confirm)' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking confirmed',
    type: BookingDto,
  })
  async confirmBooking(@Param('id') id: string): Promise<BookingDto> {
    const confirmedBooking = await this.bookingService.confirmBooking(id);
    return confirmedBooking as unknown as BookingDto;
  }

  @Post(':id/complete')
  @Action('reservation:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({ summary: 'Complete a booking' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking completed',
    type: BookingDto,
  })
  async completeBooking(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<BookingDto> {
    const userId = req.user.id;
    const completedBooking = await this.bookingService.completeBooking(
      id,
      userId,
    );
    return completedBooking as unknown as BookingDto;
  }

  @Post(':id/cancel')
  @Action('reservation:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
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

  @Post(':id/no-show')
  @Action('reservation:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @ApiOperation({ summary: 'Mark a booking as NO_SHOW' })
  @ApiParam({ name: 'id', description: 'Booking UUID' })
  @ApiResponse({
    status: 200,
    description: 'Booking marked as NO_SHOW',
    type: BookingDto,
  })
  async markNoShow(@Param('id') id: string): Promise<BookingDto> {
    const noShowBooking = await this.bookingService.noShowBooking(id);
    return noShowBooking as unknown as BookingDto;
  }

  // ----- VNPay payment integration -----

  @Post(':id/pay')
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

  @Get('table/:tableId')
  @Action('reservation:read')
  @ApiOperation({
    summary: 'Get confirmed bookings by table ID with search and pagination',
  })
  @ApiParam({ name: 'tableId', description: 'Table UUID' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of confirmed bookings',
    type: PaginatedBookingResponseDto,
  })
  async findByTableId(
    @Param('tableId') tableId: string,
    @Query() queryDto: QueryBookingByTableDto,
  ): Promise<PaginatedBookingResponseDto> {
    return this.bookingService.findByTableIdWithPagination(tableId, queryDto);
  }
}
