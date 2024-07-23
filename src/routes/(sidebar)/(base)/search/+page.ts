import type { PageLoad } from "./$types";

import type { ArticleCategories } from "$shared/types/api";
import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load = (async ({ fetch }) => {
  const fetchCategories = async (): Promise<ArticleCategories> => {
    const r = await fetch(`${PUBLIC_API_BASE}/articles/categories`);
    if (r.ok) {
      return await r.json();
    } else {
      error(r.status, "Error when fetching categories for articles.");
    }
  };

  return {
    sourceCategories: await fetchCategories(),
    meta: {
      title: "Article search | OSINTer",
      description:
        "Find specific articles in OSINTer, or check out different topics using search",
    },
  };
}) satisfies PageLoad;
