import type { PageLoad } from "./$types";
import type { ArticleBase } from "$shared/types/api";

import { inbuiltFeeds } from "$shared/config";
import { error } from "@sveltejs/kit";
import { PUBLIC_API_BASE } from "$env/static/public";

export const load = (async ({ params, fetch }) => {
  const fetchArticles = async (): Promise<ArticleBase[]> => {
    const feed = inbuiltFeeds.find(
      (inbuilt) => inbuilt.id === params.feed_name
    );
    if (!feed) return error(404, "Page was not found");

    const r = await fetch(`${PUBLIC_API_BASE}/articles/search?complete=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feed.query),
    });
    return r.ok
      ? await r.json()
      : error(r.status, "Error when fetching articles from builtin feed.");
  };

  return {
    articles: await fetchArticles(),
  };
}) satisfies PageLoad;
