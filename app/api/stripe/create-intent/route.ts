import { NextResponse } from "next/server";
import { stripe, DEPOSIT_AMOUNT_PENCE, CURRENCY } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: DEPOSIT_AMOUNT_PENCE,
      currency: CURRENCY,
      automatic_payment_methods: { enabled: false },
      payment_method_types: ["card", "link"],
      metadata: {
        fullName,
        email,
        service: "EICR Deposit",
      },
      receipt_email: email,
      description: `EICR Inspection Deposit – ${fullName}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error);
    return NextResponse.json(
      { message: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
