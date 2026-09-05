import { NextResponse } from 'next/server';

// আসল প্রোভাইডারের অ্যাড করা গিয়ার স্টোর করার জন্য অ্যারে
export let gearInventory: Array<{
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: string;
}> = [];

// GET: সব গিয়ার ফেচ
export async function GET() {
  return NextResponse.json(gearInventory, { status: 200 });
}

// POST: প্রোভাইডার নতুন গিয়ার অ্যাড করলে
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, pricePerDay, imageUrl, isAvailable } = body;

    if (!name || !category || !pricePerDay) {
      return NextResponse.json(
        { success: false, message: 'Name, Category and Price are required' },
        { status: 400 }
      );
    }

    const newGear = {
      id: `gear-${Date.now().toString().slice(-4)}`,
      name,
      category,
      pricePerDay: Number(pricePerDay),
      imageUrl: imageUrl || 'https://placehold.co/400x300?text=No+Image',
      isAvailable: isAvailable ?? true,
      createdAt: new Date().toISOString(),
    };

    gearInventory.unshift(newGear);

    return NextResponse.json(
      { success: true, data: newGear, message: 'Gear added successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload format' },
      { status: 400 }
    );
  }
}