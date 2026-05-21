import { Floor } from '../floor';

export enum TableArea {
  NORMAL = 'NORMAL',
  VIP = 'VIP',
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
}

export interface Table {
  id: string;
  name: string;
  floorId: string;
  floor: Floor;
  area: TableArea;
  seats: number;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
}

// DTOs for API requests
export interface CreateTableDto {
  name: string;
  floorId: string;
  area?: TableArea;
  seats: number;
  status?: TableStatus;
}

export interface UpdateTableDto {
  name?: string;
  floorId?: string;
  area?: TableArea;
  seats?: number;
  status?: TableStatus;
}
