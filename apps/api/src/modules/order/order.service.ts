import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        tableId: createOrderDto.tableId,
        total: createOrderDto.total,
        items: {
          create: createOrderDto.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true,
      },
    });
  }
}