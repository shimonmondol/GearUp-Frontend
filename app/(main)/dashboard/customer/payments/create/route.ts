import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const sessionId = `sess_${Date.now()}`;
    // Redirect URL: Gateways (e.g., SSLCommerz/Stripe) provide this checkout URL
    const gatewayUrl = `/payment/success?session_id=${sessionId}&order_id=${orderId}`;

    return NextResponse.json({ gatewayUrl, sessionId });
  } catch (error) {
    return NextResponse.json({ error: 'Payment session creation failed' }, { status: 500 });
  }
}