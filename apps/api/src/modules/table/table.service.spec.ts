import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './table.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TableService', () => {
  let service: TableService;
  let prisma: PrismaService;

  const mockPrisma = {
    table: {
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
        TableService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TableService>(TableService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a table', async () => {
    const dto = { number: 1, capacity: 4 };
    mockPrisma.table.create.mockResolvedValue({ id: '1', ...dto, status: 'AVAILABLE' });
    expect(await service.create(dto)).toEqual({ id: '1', ...dto, status: 'AVAILABLE' });
  });

  it('should find all tables', async () => {
    mockPrisma.table.findMany.mockResolvedValue([{ id: '1', number: 1, capacity: 4 }]);
    expect(await service.findAll()).toEqual([{ id: '1', number: 1, capacity: 4 }]);
  });
});