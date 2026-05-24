import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: PrismaService;

  const mockPrisma = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    const dto = {
      tableId: '1',
      total: 100,
      items: [{ menuItemId: '1', quantity: 1, price: 100 }],
    };
    mockPrisma.order.create.mockResolvedValue({
      id: '1',
      ...dto,
      status: 'PENDING',
    });
    expect(await service.create(dto as any, '1')).toEqual({
      id: '1',
      ...dto,
      status: 'PENDING',
    });
  });

  it('should find all orders', async () => {
    mockPrisma.order.findMany.mockResolvedValue([
      { id: '1', tableId: '1', total: 100, status: 'PENDING' },
    ]);
    expect(await service.findAll()).toEqual([
      { id: '1', tableId: '1', total: 100, status: 'PENDING' },
    ]);
  });
});
