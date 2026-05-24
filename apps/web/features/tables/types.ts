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

export interface TableMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedTableResponse {
  data: Table[];
  meta: TableMeta;
}

export interface QueryTableDto {
  search?: string;
  floorId?: string;
  status?: string;
  page?: number;
  limit?: number;
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

export interface CheckAvailableTablesDto {
  bookingTime: string;
  floorId: string;
  endTime?: string;
}

export interface BookingInfo {
  id: string;
  bookingTime: string;
  endTime: string;
  guestCount: number;
  customerName: string;
  customerPhone: string;
}

export interface TableWithBookings extends Table {
  bookings: BookingInfo[];
}

export interface PaginatedTableWithBookingsResponse {
  data: TableWithBookings[];
  meta: TableMeta;
}
