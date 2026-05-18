import { Test, TestingModule } from '@nestjs/testing';
import { TableController } from './table.controller';
import { TableService } from './table.service';

describe('TableController', () => {
  let controller: TableController;

  const mockTableService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableController],
      providers: [
        { provide: TableService, useValue: mockTableService },
      ],
    }).compile();

    controller = module.get<TableController>(TableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a table', async () => {
    const dto = { number: 1, capacity: 4 };
    mockTableService.create.mockResolvedValue({ id: '1', ...dto, status: 'AVAILABLE' });
    expect(await controller.create(dto)).toEqual({ id: '1', ...dto, status: 'AVAILABLE' });
  });
});