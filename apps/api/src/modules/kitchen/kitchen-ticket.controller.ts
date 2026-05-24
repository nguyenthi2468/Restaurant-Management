import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { KitchenTicketService } from './kitchen-ticket.service';
import { CreateKitchenTicketDto } from './dto/create-kitchen-ticket.dto';
import { UpdateKitchenTicketDto } from './dto/update-kitchen-ticket.dto';
import { KitchenTicketStatus, KitchenItemStatus } from '@prisma/client';
import { Action } from '../auth/decorator/action.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';

@ApiTags('Kitchen Tickets')
@ApiBearerAuth()
@Controller('kitchen/tickets')
export class KitchenTicketController {
  constructor(private readonly kitchenTicketService: KitchenTicketService) {}

  @Post()
  @Action('kitchen:ticket:create')
  @UseGuards(JwtAuthGuard, ActionGuard)
  create(@Body() createKitchenTicketDto: CreateKitchenTicketDto) {
    return this.kitchenTicketService.create(createKitchenTicketDto);
  }

  @Get()
  findAll() {
    return this.kitchenTicketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kitchenTicketService.findOne(id);
  }

  @Get('order/:orderId')
  findAllByOrderId(@Param('orderId') orderId: number) {
    return this.kitchenTicketService.findByOrderId(orderId);
  }

  @Patch(':id')
  @Action('kitchen:ticket:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  update(
    @Param('id') id: string,
    @Body() updateKitchenTicketDto: UpdateKitchenTicketDto,
  ) {
    return this.kitchenTicketService.update(id, updateKitchenTicketDto);
  }

  @Delete(':id')
  @Action('kitchen:ticket:delete')
  @UseGuards(JwtAuthGuard, ActionGuard)
  remove(@Param('id') id: string) {
    return this.kitchenTicketService.remove(id);
  }

  @Patch(':id/accept')
  @Action('kitchen:ticket:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  acceptTicket(@Param('id') id: string) {
    return this.kitchenTicketService.acceptTicket(id, 'user_id');
  }

  @Patch(':id/complete')
  @Action('kitchen:ticket:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  completeTicket(@Param('id') id: string) {
    return this.kitchenTicketService.completeTicket(id);
  }

  @Patch('items/:itemId/status')
  @Action('kitchen:ticket:update')
  @UseGuards(JwtAuthGuard, ActionGuard)
  updateItemStatus(
    @Param('itemId') itemId: string,
    @Body('status') status: KitchenItemStatus,
  ) {
    return this.kitchenTicketService.updateItemStatus(itemId, status);
  }
}
