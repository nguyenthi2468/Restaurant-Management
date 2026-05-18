import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';

describe('OrderItemController', () => {
  let controller: OrderItemController;
  let service: OrderItemService;

  const mockOrderItemService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        { provide: OrderItemService, useValue: mockOrderItemService },
      ],
    }).compile();

    controller = module.get<OrderItemController>(OrderItemController);
    service = module.get<OrderItemService>(OrderItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order item', async () => {
    const dto = { orderId: '1', menuItemId: '1', quantity: 1, price: 100 };
    mockOrderItemService.create.mockResolvedValue({ id: '1', ...dto });
    expect(await controller.create(dto as any)).toEqual({ id: '1', ...dto });
  });

  it('should find all order items', async () => {
    mockOrderItemService.findAll.mockResolvedValue([{ id: '1', orderId: '1', menuItemId: '1', quantity: 1, price: 100 }]);
    expect(await controller.findAll()).toEqual([{ id: '1', orderId: '1', menuItemId: '1', quantity: 1, price: 100 }]);
  });
});