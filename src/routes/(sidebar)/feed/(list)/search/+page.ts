import type { PageLoad } from "./$types";

import type { ArticleBase } from "$shared/types/api";
import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load = (async ({ fetch, parent }) => {
  const { searchUrl } = await parent();

  const fetchArticles = async (): Promise<ArticleBase[]> => {
    const r = await fetch(`${PUBLIC_API_BASE}/articles/search?${searchUrl}`);
    if (r.ok) {
      return await r.json();
    } else {
      throw error(r.status, "Error when fetching articles based on search.");
    }
  };

  return {
    articles: fetchArticles(),
  };
}) satisfies PageLoad;
