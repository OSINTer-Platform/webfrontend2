import { getPosts } from "$lib/common/blog";

import type { LayoutServerLoad } from "./$types";
export const load = (async () => {
  return { posts: getPosts() };
}) satisfies LayoutServerLoad;
