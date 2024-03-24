import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import type { MLAvailability } from "$shared/types/api";
import { get } from "svelte/store";

export const load: LayoutLoad = async ({ parent, url }) => {
  const { user, mlAvailability } = await parent();
  const userContent = get(user);

  type mlTypes = keyof MLAvailability;

  const depends: { [key: string]: mlTypes } = {
    "/topic": "clustering",
    "/overview": "map",
    "/assistant": "inference",
  };

  for (const [route, dependency] of Object.entries(depends)) {
    if (url.pathname.startsWith(route) && !mlAvailability[dependency])
      throw error(421, {
        message: "",
        title: "Requested functionality isn't available",
        description: [
          "This functionality requested is not available on this specific instance of OSINTer.",
          "Believe this is a mistake?",
          "Contact us below",
        ],
      });
  }

  if (!userContent || !(userContent.premium > 0))
    throw error(403, {
      message: "",
      title: `This page is reserved${
        userContent
          ? " for beta-testers and B2B partners."
          : ", and you are not logged in."
      }`,
      description: [
        "We are at OSINTer currently beta-testing new features",
        "Do you want early access?",
        userContent ? "Contact us below" : "Log in below",
      ],
      logo: false,
      actions: userContent ? undefined : [{ title: "Login", href: "/login" }],
    });
};
