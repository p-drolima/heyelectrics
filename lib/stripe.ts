import Stripe from "stripe";
import { DEPOSIT_PENCE, DEPOSIT_DISPLAY, CURRENCY } from "@/lib/pricing";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const DEPOSIT_AMOUNT_PENCE = DEPOSIT_PENCE;
export const DEPOSIT_AMOUNT_DISPLAY = DEPOSIT_DISPLAY;
export { CURRENCY };
