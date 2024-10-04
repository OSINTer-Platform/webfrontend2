import { PUBLIC_API_BASE } from "$env/static/public";
import type { PriceCalculation } from "$shared/types/stripe";
import type { PriceLookupKey } from "$shared/types/userItems";

export async function getPrice(
  priceKey: PriceLookupKey
): Promise<PriceCalculation | null> {
  const r = await fetch(
    `${PUBLIC_API_BASE}/payment/price/calc/${encodeURIComponent(priceKey)}`
  );

  if (r.ok) return r.json();
  else return null;
}

export type PaymentType = "base" | "pro" | "enterprise";
export const paymentTypes: PaymentType[] = [
  "base",
  "pro",
  "enterprise",
] as const;

export const isPaymentType = (s: string): s is PaymentType =>
  paymentTypes.includes(s as any);
