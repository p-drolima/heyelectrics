import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { BOILER_SERVICE_PENCE, BOILER_CURRENCY } from "@/lib/boiler-pricing";

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
      amount: BOILER_SERVICE_PENCE,
      currency: BOILER_CURRENCY,
      automatic_payment_methods: { enabled: false },
      payment_method_types: ["card", "link"],
      metadata: {
        fullName,
        email,
        service: "Boiler Service",
      },
      receipt_email: email,
      description: `Boiler Service \u2013 ${fullName}`,
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
