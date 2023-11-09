import type { ParamMatcher } from "@sveltejs/kit";

export const match: ParamMatcher = (param) => {
  return /^[0-9]+/.test(param) || /^[a-zA-Z0-9-_]{32}$/.test(param);
};
