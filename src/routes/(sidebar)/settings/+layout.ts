import { error } from "@sveltejs/kit";
import { get } from "svelte/store";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent }) => {
  const { user } = await parent();
  const userContent = get(user);

  if (!userContent)
    error(403, {
      message: "",
      title: "You have to be logged in to access settings",
      description: ["Do you already have a user? Login below."],
      logo: false,
      actions: [
        { title: "Login", href: "/login" },
        { title: "Signup", href: "/signup" },
      ],
    });

  return {
    userContents: userContent,
  };
};
