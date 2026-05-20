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

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: string | number;
  createdAt: string;
  updatedAt: string;
  menuItem?: {
    id: string;
    name: string;
    price: string | number;
  };
}

export interface CreateOrderData {
  tableId: string;
  total: number;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  note?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface UpdateOrderData {
  tableId?: string;
  status?: OrderStatus;
  total?: number;
  note?: string;
  customerName?: string;
  customerPhone?: string;
}
