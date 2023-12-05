import type { ParamMatcher } from "@sveltejs/kit";
import { dashboards } from "$shared/types/internal";

export const match = ((param) => {
  return dashboards.some((v) => v === param);
}) satisfies ParamMatcher;
