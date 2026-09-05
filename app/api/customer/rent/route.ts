import { NextResponse } from 'next/server';
import { ordersDatabase } from '@/app/api/provider/orders/route';
import { gearInventory } from '@/app/api/provider/gear/route';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gearId, customerName, customerEmail, startDate, endDate, rentalDays } = body;

    // ১. গিয়ার খুঁজে বের করা
    const targetGearIndex = gearInventory.findIndex((g) => g.id === gearId);
    if (targetGearIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Gear not found in inventory' },
        { status: 404 }
      );
    }

    const targetGear = gearInventory[targetGearIndex];

    if (!targetGear.isAvailable) {
      return NextResponse.json(
        { success: false, message: 'This gear is currently already rented / unavailable' },
        { status: 400 }
      );
    }

    const calculatedPrice = targetGear.pricePerDay * (Number(rentalDays) || 1);

    // ২. নতুন রেন্টাল অর্ডার তৈরি
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      gearId: targetGear.id,
      gearName: targetGear.name,
      customerName: customerName || 'Customer',
      customerEmail: customerEmail || 'customer@example.com',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      totalPrice: calculatedPrice,
      status: 'Pending' as const,
      createdAt: new Date().toISOString(),
    };

    // ৩. ইনভেন্টরিতে গিয়ার স্ট্যাটাস Unavailable করা
    gearInventory[targetGearIndex].isAvailable = false;

    // ৪. প্রোভাইডারের অর্ডারে পুশ করা
    ordersDatabase.unshift(newOrder);

    return NextResponse.json(
      { success: true, data: newOrder, message: 'Rental booked successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process rental' },
      { status: 500 }
    );
  }
}