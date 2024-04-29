import type { PageLoad } from "./$types";

import { error } from "@sveltejs/kit";
import { queryArticles } from "$lib/common/queryArticles";

export const load = (async ({ fetch, parent }) => {
  const { currentSearch } = await parent();

  const articleQuery = await queryArticles(currentSearch, false, fetch);
  if (!articleQuery.articles)
    error(
      articleQuery.response.status,
      "Error when fetching articles based on search"
    );

  return {
    articles: articleQuery.articles,
  };
}) satisfies PageLoad;
