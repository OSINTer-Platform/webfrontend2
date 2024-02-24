import { config } from "$shared/config";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ parent, params }) => {
  const { posts } = await parent();
  const currentPost = posts[params.blogTitle];

  if (!currentPost) {
    throw error(404, "Post not found");
  }
  return {
    currentPost: currentPost,
    meta: {
      title: `${currentPost.title} | OSINTer`,
      description: currentPost.description,
      type: "article",
      image: currentPost.image ?? config.images.fullLogo,
    },
  };
}) satisfies PageLoad;
