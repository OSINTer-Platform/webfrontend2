import { error } from "@sveltejs/kit";
import { get } from "svelte/store";

import type { LayoutLoad } from "./$types";
import type { AuthArea, MLAvailability } from "$shared/types/api";

export const load: LayoutLoad = async ({ parent, url }) => {
  const { user, mlAvailability, authorizeForArea } = await parent();
  const userContent = get(user);
  const authorizer = get(authorizeForArea);

  const routeProtections: {
    route: string;
    authArea: AuthArea;
    dependency?: keyof MLAvailability;
  }[] = [
    { route: "/topic", authArea: "cluster", dependency: "cluster" },
    { route: "/overview", authArea: "map", dependency: "map" },
    { route: "/assistant", authArea: "assistant", dependency: "assistant" },
    { route: "/dashboard", authArea: "dashboard" },
    { route: "/cve", authArea: "cve" },
  ];

  routeProtections.forEach(({ route, authArea, dependency }) => {
    if (!url.pathname.startsWith(route)) return;

    if (dependency && !mlAvailability[dependency])
      error(421, {
        message: "",
        title: "Requested functionality isn't available",
        description: [
          "This functionality requested is not available on this specific instance of OSINTer.",
          "Believe this is a mistake?",
          "Contact us below",
        ],
      });

    if (!authorizer(authArea))
      error(403, {
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
  });
};
