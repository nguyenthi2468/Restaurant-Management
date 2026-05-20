import type { CashierTable, CashierMenuItem, CashierOrder } from './types';

export const getTables = async (): Promise<CashierTable[]> => {
  const res = await fetch('/api/cashier/tables', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch tables');
  return res.json();
};

export const getMenuItems = async (): Promise<CashierMenuItem[]> => {
  const res = await fetch('/api/cashier/menu', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch menu items');
  return res.json();
};

export const getOrderByTableId = async (tableId: string): Promise<CashierOrder | null> => {
  const res = await fetch(`/api/cashier/orders?tableId=${encodeURIComponent(tableId)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch order');
  return res.json();
};

export const createOrUpdateOrder = async (data: {
  tableId: string;
  tableName: string;
  items: Omit<OrderItem, 'total'>[];
  totalAmount: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}): Promise<CashierOrder> => {
  const res = await fetch('/api/cashier/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save order');
  return res.json();
};

type OrderItem = CashierOrder['items'][number];
