import { PUBLIC_API_BASE } from "$env/static/public";
import type { Collection, Feed } from "$shared/types/userItems";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import type { ArticleCategories } from "$shared/types/api";

export const load = (async ({ params, fetch }) => {
  const fetchItem = async (): Promise<Feed | Collection> => {
    const r = await fetch(
      `${PUBLIC_API_BASE}/user-items/${params.item_id}/content`
    );

    if (r.ok) {
      return await r.json();
    } else {
      error(r.status, "Error when fetching description of user-item.");
    }
  };

  const fetchCategories = async (): Promise<ArticleCategories> => {
    const r = await fetch(`${PUBLIC_API_BASE}/articles/categories`);
    return r.ok
      ? await r.json()
      : error(r.status, "Error when fetching article categories.");
  };

  const [currentItem, sourceCategories] = await Promise.all([
    fetchItem(),
    fetchCategories(),
  ]);

  return {
    sourceCategories,
    currentItem,
    meta: {
      title: `${currentItem.name} | OSINTer`,
      description: `News related to the ${currentItem.type} "${currentItem.name}"`,
    },
  };
}) satisfies LayoutLoad;
