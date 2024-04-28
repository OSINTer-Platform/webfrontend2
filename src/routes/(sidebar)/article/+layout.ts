import type { LayoutLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { get } from "svelte/store";

export const load: LayoutLoad = async ({ parent }) => {
  const parentData = await parent();
  const user = get(parentData.user);

  if (!user)
    error(401, {
      message: "",
      title: "You have to be logged in to access this article",
      description: [
        "Full-page rendering are only available to logged-in users",
        "Do you want to try it out?",
        "Log in or sign-up below",
      ],
      logo: false,
      actions: [
        { title: "Login", href: "/login" },
        { title: "Sign-up", href: "/signup" },
      ],
    });
  return {
    customSidebar: true,
  };
};
