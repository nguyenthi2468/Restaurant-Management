import { OrderItem } from "../order-items";
import { Table } from "../tables";

export enum OrderStatus {
  PENDING = 'PENDING',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
export interface Order {
  id: number;
  tableId: string;
  status: OrderStatus;
  total: string | number;
  createdAt: string;
  updatedAt: string;
  note?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  items?: OrderItem[];
  orderTables?: OrderTable[];
}

export interface OrderTable {
  id: string;
  orderId: number;
  tableId: string;
  createdAt: string;
  table: Table;
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
