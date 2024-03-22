import type { PageLoad } from "./$types";
import type { Price } from "$shared/types/stripe";

import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ url }) => {
  const prices: Price[] = await fetch(`${PUBLIC_API_BASE}/payment/prices`).then(
    (r) => r.json()
  );
  const price: undefined | Price = prices.find(
    (price) => price.lookup_key == "pro-month"
  );

  if (!price) throw error(500, "Error when querying prices");

  return {
    paymentIntentClientSecret: url.searchParams.get(
      "payment_intent_client_secret"
    ),
    personalPrice: price,
  };
};
