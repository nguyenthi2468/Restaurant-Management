import { OrderItem } from "../order-items";

export enum OrderStatus {
  PENDING = 'PENDING',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
export interface Order {
  id: string;
  tableId: string;
  status: OrderStatus;
  total: string | number;
  createdAt: string;
  updatedAt: string;
  note?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  items?: OrderItem[];
}

export interface CreateOrderData {
  tableIds: string[];
  total?: number;
  items?: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  customerId?: string;
  note?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface UpdateOrderData {
  tableIds?: string[];
  status?: OrderStatus;
  total?: number;
  note?: string;
  customerName?: string;
  customerPhone?: string;
}
