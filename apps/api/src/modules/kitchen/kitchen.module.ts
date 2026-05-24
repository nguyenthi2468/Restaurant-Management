import { Module } from '@nestjs/common';
import { KitchenTicketService } from './kitchen-ticket.service';
import { KitchenTicketController } from './kitchen-ticket.controller';

@Module({
  providers: [KitchenTicketService],
  controllers: [KitchenTicketController],
  exports: [KitchenTicketService],
})
export class KitchenModule {}
