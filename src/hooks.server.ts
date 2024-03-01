import { env } from "$env/dynamic/private";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (env.MAINTENANCE_MODE == "1" && event.route.id != "/maintenance") {
    let location = "/maintenance";
    if (env.MAINTENANCE_ETC)
      location += `?etc=${encodeURIComponent(env.MAINTENANCE_ETC)}`;
    return new Response(undefined, { status: 302, headers: { location } });
  }

  return await resolve(event);
};
