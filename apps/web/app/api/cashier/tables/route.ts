import { NextResponse } from 'next/server';
import { tables } from '@/data/cashier';

export async function GET() {
  return NextResponse.json(tables);
}
