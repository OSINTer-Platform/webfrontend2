import { inbuiltFeeds } from "$shared/config";
import { error } from "@sveltejs/kit";

import type { LayoutLoad } from "./$types";

export const load = (async ({ params }) => {
  const feed = inbuiltFeeds.find(({ id }) => id === params.feed_name);
  if (!feed) return error(404, "Page was not found");

  return {
    currentItem: feed,
    meta: {
      title: `${feed.title} | OSINTer`,
      description: feed.desc,
    },
  };
}) satisfies LayoutLoad;
