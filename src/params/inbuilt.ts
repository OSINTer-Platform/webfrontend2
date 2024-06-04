import type { ParamMatcher } from "@sveltejs/kit";
import { inbuiltFeeds } from "$shared/config";

export const match = ((param) => {
  return inbuiltFeeds.some((inbuiltFeed) => inbuiltFeed.id === param);
}) satisfies ParamMatcher;
