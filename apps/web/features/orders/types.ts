import { OrderItem } from '../order-items';
import { Table } from '../tables';
import { Payment, PaymentMethod } from '../payments';

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
  depositAmount: number;
  updatedAt: string;
  note?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  items?: OrderItem[];
  orderTables?: OrderTable[];
  payments:Payment[]
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

export interface CompleteOrderData {
  paymentMethod: PaymentMethod;
  totalAmount: number;
}

export interface GetOrdersQueryParams {
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrdersResponse {
  data: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
