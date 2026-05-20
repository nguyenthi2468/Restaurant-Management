import { NextResponse } from 'next/server';
import { orders } from '@/data/cashier';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tableId = searchParams.get('tableId');

  if (tableId) {
    const order = orders.find((o) => o.tableId === tableId) || null;
    return NextResponse.json(order);
  }

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tableId, items, totalAmount, customerName, customerPhone, notes } =
    body;

  const existingIndex = orders.findIndex((o) => o.tableId === tableId);
  const newOrder = {
    id: `o-${tableId}-${Date.now()}`,
    tableId,
    tableName: items.tableName || tableId,
    status: 'pending' as const,
    customerName: customerName || '',
    customerPhone: customerPhone || '',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    totalAmount: totalAmount || 0,
    items: items || [],
  };

  if (existingIndex >= 0) {
    orders[existingIndex] = {
      ...orders[existingIndex],
      ...newOrder,
      id: orders[existingIndex].id,
    };
    return NextResponse.json(orders[existingIndex]);
  }

  orders.push(newOrder);
  return NextResponse.json(newOrder);
}
