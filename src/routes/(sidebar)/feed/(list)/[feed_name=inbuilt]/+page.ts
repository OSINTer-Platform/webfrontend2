import type { PageLoad } from "./$types";

import { inbuiltFeeds } from "$shared/config";
import type { ArticleBase } from "$shared/types/api";
import { error } from "@sveltejs/kit";

export const load = (async ({ params, fetch }) => {
  const fetchArticles = async (): Promise<ArticleBase[]> => {
    const r = await fetch(inbuiltFeeds[params.feed_name].url.toString());
    if (r.ok) {
      return await r.json();
    } else {
      throw error(r.status, "Error when fetching articles from builtin feed.");
    }
  };

  return {
    articles: await fetchArticles(),
  };
}) satisfies PageLoad;
