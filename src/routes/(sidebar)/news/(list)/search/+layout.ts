import { articleSearchQueryFromUrl } from "$lib/common/searchQuery";

import type { LayoutLoad } from "./$types";

export const load = (async ({ url, parent }) => {
  const parentData = await parent();
  const searchQuery = articleSearchQueryFromUrl(url.searchParams);

  if (!parentData.mlAvailability?.elser)
    searchQuery.semantic_search = undefined;
  return {
    currentSearch: searchQuery,
    meta: {
      title: "Custom search | OSINTer",
      description: "See articles matching your custom search",
    },
  };
}) satisfies LayoutLoad;
