import { PUBLIC_API_BASE } from "$env/static/public";
import type { Collection, Feed } from "$shared/types/userItems";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
  const fetchItem = async (): Promise<Feed | Collection> => {
    const r = await fetch(
      `${PUBLIC_API_BASE}/user-items/${params.item_id}/content`
    );

    if (r.ok) {
      return await r.json();
    } else {
      throw error(r.status, "Error when fetching description of user-item.");
    }
  };

  const currentItem = await fetchItem();

  return {
    currentItem,
    meta: {
      title: `${currentItem.name} | OSINTer`,
      description: `News related to the ${currentItem.type} "${currentItem.name}"`,
    },
  };
}) satisfies LayoutLoad;
