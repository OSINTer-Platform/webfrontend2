import { getPosts } from "$lib/common/blog";

import type { LayoutServerLoad } from "./$types";
export const load = (async () => {
  return {
    posts: getPosts(),
    meta: {
      title: "Blog | OSINTer",
      description:
        "Keep up with the latest news, releases and improvements for OSINTer, delivered straight to you from the OSINTer core developement team.",
    },
  };
}) satisfies LayoutServerLoad;
