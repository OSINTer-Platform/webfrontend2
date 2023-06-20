import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (({ cookies }) => {
  cookies.set("access_token", "", {
    maxAge: 0,
    expires: new Date(),

    path: "/",
  });

  throw redirect(301, "/");
}) satisfies PageServerLoad;
