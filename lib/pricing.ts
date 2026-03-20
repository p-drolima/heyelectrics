// ── EICR Service Pricing (single source of truth) ───────────────────
// Price is £180 per bedroom. Deposit is a flat £60.

export const PRICE_PER_BEDROOM_PENCE = 18000; // £180.00
export const PRICE_PER_BEDROOM_DISPLAY = "£180.00";

export const DEPOSIT_PENCE = 6000; // £60.00
export const DEPOSIT_DISPLAY = "£60.00";
export const DEPOSIT_NUMERIC = 60.0;

export const CURRENCY = "gbp";

export function getServicePrice(bedrooms: number) {
  const pence = PRICE_PER_BEDROOM_PENCE * bedrooms;
  return {
    pence,
    display: `£${(pence / 100).toFixed(2)}`,
    numeric: pence / 100,
  };
}

export function getBalance(bedrooms: number) {
  const servicePence = PRICE_PER_BEDROOM_PENCE * bedrooms;
  const balancePence = servicePence - DEPOSIT_PENCE;
  return {
    pence: balancePence,
    display: `£${(balancePence / 100).toFixed(2)}`,
    numeric: balancePence / 100,
  };
}
