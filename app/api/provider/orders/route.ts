import { NextResponse } from 'next/server';

export interface OrderItem {
  id: string;
  gearId: string;
  gearName: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Picked Up' | 'Returned' | 'Cancelled';
  createdAt: string;
}

export let ordersDatabase: OrderItem[] = [];

export async function GET() {
  return NextResponse.json(ordersDatabase, { status: 200 });
}