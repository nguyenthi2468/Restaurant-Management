import { NextResponse } from 'next/server';
import { menuItems } from '@/data/cashier';

export async function GET() {
  return NextResponse.json(menuItems);
}
