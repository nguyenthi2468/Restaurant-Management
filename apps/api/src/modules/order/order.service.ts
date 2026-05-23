import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { tableIds, items, ...orderData } = createOrderDto;

    return this.prisma.order.create({
      data: {
        total: orderData.total,
        note: orderData.note,
        createdById: userId,
        customerId: orderData.customerId,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        // Tạo liên kết với bàn qua OrderTable junction table
        orderTables: tableIds?.length
          ? {
              create: tableIds.map((tableId) => ({
                table: {
                  connect: { id: tableId },
                },
              })),
            }
          : undefined,
        items: {
          create: items?.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
        orderTables: {
          include: {
            table: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true,
        orderTables: {
          include: {
            table: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        orderTables: {
          include: {
            table: true,
          },
        },
        payments: true,
      },
    });
  }
}
