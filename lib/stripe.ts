import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const DEPOSIT_AMOUNT_PENCE = 6000; // £60.00
export const DEPOSIT_AMOUNT_DISPLAY = "£60.00";
export const CURRENCY = "gbp";
