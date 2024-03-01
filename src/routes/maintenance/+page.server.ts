import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";

export const load = (async () => {
  if (env.MAINTENANCE_MODE !== "1") throw redirect(302, "/");
}) satisfies PageServerLoad;
