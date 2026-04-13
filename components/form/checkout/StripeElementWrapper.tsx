"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { ReactNode } from "react";

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeElementWrapperProps {
  clientSecret: string;
  children: ReactNode;
}

/**
 * Provides the Stripe Elements context. Any child that calls
 * useStripe() or useElements() must be rendered inside this wrapper.
 */
export function StripeElementWrapper({
  clientSecret,
  children,
}: StripeElementWrapperProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#44B4D7",
            borderRadius: "6px",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
