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
      throw error(
        r.status,
        "Error when fetching categories for articles. Please contact system administrator"
      );
    }
  };

  return {
    sourceCategories: fetchCategories(),
  };
}) satisfies PageLoad;
