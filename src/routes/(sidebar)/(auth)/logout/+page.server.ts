import type { Actions } from "./$types";

export const actions = {
  default: ({ cookies }) => {
    cookies.set("access_token", "", {
      maxAge: 0,
      expires: new Date(),

      path: "/",
    });
  },
} satisfies Actions;
