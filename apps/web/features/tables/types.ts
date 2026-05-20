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
  floor: string;
  area: TableArea;
  seats: number;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
}

// DTOs for API requests
export interface CreateTableDto {
  name: string;
  floor: string;
  area?: TableArea;
  seats: number;
  status?: TableStatus;
}

export interface UpdateTableDto {
  name?: string;
  floor?: string;
  area?: TableArea;
  seats?: number;
  status?: TableStatus;
}
