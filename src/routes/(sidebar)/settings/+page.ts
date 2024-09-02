import { PUBLIC_API_BASE } from "$env/static/public";

import type { LayoutLoad } from "./$types";
import type { Webhook } from "$shared/types/userItems";

export const load: LayoutLoad = async ({ fetch, depends }) => {
  depends("data:webhook");

  async function getWebhooks(): Promise<Webhook[]> {
    const r = await fetch(`${PUBLIC_API_BASE}/user-items/webhook/list`);
    if (r.ok) return r.json();
    else return [];
  }

  return {
    webhooks: await getWebhooks(),
  };
};
