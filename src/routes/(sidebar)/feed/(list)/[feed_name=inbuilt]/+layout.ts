import { inbuiltFeeds } from "$shared/config";

import type { LayoutLoad } from "./$types";

export const load = (async ({ params }) => {
  const feed = inbuiltFeeds[params.feed_name];

  return {
    currentItem: feed,
    meta: {
      title: `${feed.title} | OSINTer`,
      description: feed.desc,
    },
  };
}) satisfies LayoutLoad;
