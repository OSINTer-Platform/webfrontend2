import { getPosts, sortPosts } from "$lib/common/blog";

import type { PageServerLoad } from "./$types";
export const load: Omit<PageServerLoad, ""> = () => {
  return {
    posts: sortPosts(Object.values(getPosts())).slice(0, 4),
    burgerMenu: false,
  };
};
