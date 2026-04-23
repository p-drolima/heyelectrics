// ── EICR Service Pricing (single source of truth) ───────────────────
// Flat £180 for 1–5 bedrooms. 5+ goes to enquiry form (no fixed price).

export const SERVICE_PRICE_PENCE = 15000; // £150.00
export const SERVICE_PRICE_DISPLAY = "£150.00";
export const SERVICE_PRICE_NUMERIC = 150.0;

export const DEPOSIT_PENCE = 2999; // £29.99
export const DEPOSIT_DISPLAY = "£29.99";
export const DEPOSIT_NUMERIC = 29.99;

export const BALANCE_PENCE = SERVICE_PRICE_PENCE - DEPOSIT_PENCE;
export const BALANCE_DISPLAY = `£${(BALANCE_PENCE / 100).toFixed(2)}`;
export const BALANCE_NUMERIC = BALANCE_PENCE / 100;

export const CURRENCY = "gbp";
