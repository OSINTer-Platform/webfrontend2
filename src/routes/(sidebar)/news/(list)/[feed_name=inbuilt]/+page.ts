import type { PageLoad } from "./$types";
import type { ArticleBase } from "$shared/types/api";

import { inbuiltFeeds } from "$shared/config";
import { error } from "@sveltejs/kit";

export const load = (async ({ params, fetch }) => {
  const fetchArticles = async (): Promise<ArticleBase[]> => {
    const feed = inbuiltFeeds.find(
      (inbuilt) => inbuilt.id === params.feed_name
    );
    if (!feed) return error(404, "Page was not found");

    const r = await fetch(feed.url);
    return r.ok
      ? await r.json()
      : error(r.status, "Error when fetching articles from builtin feed.");
  };

  return {
    articles: await fetchArticles(),
  };
}) satisfies PageLoad;
