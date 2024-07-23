import { articleSearchQueryFromUrl } from "$lib/common/searchQuery";

import type { LayoutLoad } from "./$types";

export const load = (async ({ url }) => {
  const searchQuery = articleSearchQueryFromUrl(url.searchParams);

  return {
    currentSearch: searchQuery,
    meta: {
      title: "Custom search | OSINTer",
      description: "See articles matching your custom search",
    },
  };
}) satisfies LayoutLoad;
