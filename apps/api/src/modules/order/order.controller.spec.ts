import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: mockOrderService }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order', async () => {
    const dto = {
      tableId: '1',
      total: 100,
      items: [{ menuItemId: '1', quantity: 1, price: 100 }],
    };
    mockOrderService.create.mockResolvedValue({
      id: '1',
      ...dto,
      status: 'PENDING',
    });
    expect(await controller.create(dto as any)).toEqual({
      id: '1',
      ...dto,
      status: 'PENDING',
    });
  });
});
