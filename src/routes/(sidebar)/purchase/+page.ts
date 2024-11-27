import type { PageLoad } from "./$types";

import { PUBLIC_PURCHASE_AVAILABLE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ url }) => {
  if (!PUBLIC_PURCHASE_AVAILABLE)
    error(404, "Payment options aren't available on this OSINTer instance");

  return {
    plan: url.searchParams.get("plan"),
  };
};
