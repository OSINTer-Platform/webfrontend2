import type { PageLoad } from "./$types";
import type { Price } from "$shared/types/stripe";

import { PUBLIC_API_BASE, PUBLIC_PURCHASE_AVAILABLE } from "$env/static/public";
import { error, redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

export const load: PageLoad = async ({ fetch, parent, url }) => {
  if (!PUBLIC_PURCHASE_AVAILABLE)
    error(404, "Payment options aren't available on this OSINTer instance");
  const { user } = await parent();
  const userContent = get(user);

  if (!userContent)
    redirect(
      303,
      "/login?msg=" +
        encodeURIComponent("You need to be logged in to subscribe to OSINTer")
    );

  const prices: { [key: string]: Price } = await fetch(
    `${PUBLIC_API_BASE}/payment/prices`
  ).then((r) => r.json());
  const proPrice: undefined | Price = Object.values(prices).find(
    (price) => price.lookup_key == "pro-month"
  );
  const basePrice: undefined | Price = Object.values(prices).find(
    (price) => price.lookup_key == "base-month"
  );

  if (!proPrice || !basePrice) error(500, "Error when querying prices");

  return {
    proPrice,
    basePrice,
    plan: url.searchParams.get("plan"),
  };
};
