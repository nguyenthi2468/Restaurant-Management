import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrderItemService', () => {
  let service: OrderItemService;
  let prisma: PrismaService;

  const mockPrisma = {
    orderItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order item', async () => {
    const dto = { orderId: '1', menuItemId: '1', quantity: 1, price: 100 };
    mockPrisma.orderItem.create.mockResolvedValue({ id: '1', ...dto });
    expect(await service.create(dto as any)).toEqual({ id: '1', ...dto });
  });

  it('should find all order items', async () => {
    mockPrisma.orderItem.findMany.mockResolvedValue([
      { id: '1', orderId: '1', menuItemId: '1', quantity: 1, price: 100 },
    ]);
    expect(await service.findAll()).toEqual([
      { id: '1', orderId: '1', menuItemId: '1', quantity: 1, price: 100 },
    ]);
  });
});
