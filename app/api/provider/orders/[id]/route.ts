import { NextRequest, NextResponse } from "next/server";
import { ordersDatabase } from "../route";
import { gearInventory } from "../../gear/route";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const orderIndex = ordersDatabase.findIndex((order) => order.id === id);

    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, message: `Order with ID ${id} not found` },
        { status: 404 },
      );
    }

    const currentOrder = ordersDatabase[orderIndex];
    currentOrder.status = status;

    // গিয়ার রিটার্ন করা হলে ইনভেন্টরিতে স্টক ফিরিয়ে দেওয়া
    if (status === "Returned") {
      const gearIndex = gearInventory.findIndex(
        (g) => g.id === currentOrder.gearId,
      );
      if (gearIndex !== -1) {
        gearInventory[gearIndex].isAvailable = true;
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: currentOrder,
        message: `Order status updated to '${status}'`,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
