import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (() => {
  redirect(302, "/news/day");
}) satisfies PageLoad;
