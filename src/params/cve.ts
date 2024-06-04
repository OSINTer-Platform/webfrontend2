import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((param) => {
  return /^CVE-[0-9]{4}-[0-9]{4,9}$/.test(param);
}) satisfies ParamMatcher;
