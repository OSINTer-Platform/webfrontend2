import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((param) => {
  return /^[0-9a-zA-Z-]*$/.test(param);
}) satisfies ParamMatcher;
