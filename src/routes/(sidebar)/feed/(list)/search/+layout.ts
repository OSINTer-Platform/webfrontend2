import { fromUrl, toUrl } from "$lib/common/searchQuery";

import type { LayoutLoad } from "./$types";

export const load = (async ({ url }) => {
  const searchQuery = fromUrl(url.searchParams);
  return { currentSearch: searchQuery, searchUrl: toUrl(searchQuery) };
}) satisfies LayoutLoad;
