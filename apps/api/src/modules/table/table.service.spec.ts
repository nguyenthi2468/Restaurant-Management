import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './table.service';
import { PrismaService } from '../prisma/prisma.service';
import { TableArea, TableStatus } from '@prisma/client';

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
    const dto = { name: 'T1', floor: '1', area: TableArea.NORMAL, seats: 4 };
    mockPrisma.table.findUnique.mockResolvedValue(null);
    mockPrisma.table.create.mockResolvedValue({
      id: '1',
      ...dto,
      status: TableStatus.AVAILABLE,
    });
    expect(await service.create(dto)).toEqual({
      id: '1',
      ...dto,
      status: TableStatus.AVAILABLE,
    });
  });

  it('should find all tables', async () => {
    mockPrisma.table.findMany.mockResolvedValue([
      {
        id: '1',
        name: 'T1',
        floor: '1',
        area: TableArea.NORMAL,
        seats: 4,
        status: TableStatus.AVAILABLE,
      },
    ]);
    expect(await service.findAll()).toEqual([
      {
        id: '1',
        name: 'T1',
        floor: '1',
        area: TableArea.NORMAL,
        seats: 4,
        status: TableStatus.AVAILABLE,
      },
    ]);
  });
});
