import type { PageLoad } from "./$types";
import type { ArticleBase } from "$shared/types/api";

import { inbuiltFeeds } from "$shared/config";
import { error } from "@sveltejs/kit";
import { queryArticles } from "$lib/common/queryArticles";

export const load = (async ({ params, fetch }) => {
  const fetchArticles = async (): Promise<ArticleBase[]> => {
    const feed = inbuiltFeeds.find(
      (inbuilt) => inbuilt.id === params.feed_name
    );
    if (!feed) return error(404, "Page was not found");

    const articleQuery = await queryArticles(feed.query, false, fetch);
    return articleQuery.documents
      ? articleQuery.documents
      : error(
          articleQuery.response.status,
          "Error when fetching articles from builtin feed."
        );
  };

  return {
    articles: await fetchArticles(),
  };
}) satisfies PageLoad;
