import { fromUrl, toUrl } from "$lib/common/searchQuery";

import type { LayoutLoad } from "./$types";

export const load = (async ({ url, parent }) => {
  const parentData = await parent();
  const searchQuery = fromUrl(url.searchParams);

  if (!parentData.mlAvailability?.elser)
    searchQuery.semantic_search = undefined;
  return { currentSearch: searchQuery, searchUrl: toUrl(searchQuery) };
}) satisfies LayoutLoad;
