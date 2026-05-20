export interface CashierTable {
  id: string;
  name: string;
  floor: string;
  area: 'normal' | 'vip';
  status: 'available' | 'occupied' | 'reserved';
  seats: number;
  currentOrderId: string | null;
  startedAt: string | null;
  elapsedMinutes: number;
  itemCount: number;
}

export interface CashierMenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
  total: number;
}

export interface CashierOrder {
  id: string;
  tableId: string;
  tableName: string;
  status: 'pending' | 'processing' | 'ready' | 'served' | 'paid';
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  notes: string;
}

export type TableFilter = 'all' | 'occupied' | 'available';
