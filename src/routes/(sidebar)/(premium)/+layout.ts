import { error } from "@sveltejs/kit";
import { get } from "svelte/store";
import { contactEmail } from "$shared/config";

import type { LayoutLoad } from "./$types";
import type { AuthArea, MLAvailability } from "$shared/types/api";

export const load: LayoutLoad = async ({ parent, url }) => {
  const { user, mlAvailability, checkAuthorization } = await parent();
  const userContent = get(user);
  const authorizer = get(checkAuthorization);

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
      if (userContent)
        error(403, {
          message: "",
          title:
            "This page is reserved for OSINTer PRO users, and you're not subscribed",
          description: [
            "Some of the services from OSINTer are restricted to our paying (or selfhosting) users",
            "As such, you have to be subscribed to a OSINTer PRO plan to access the following page",
            "Signup for OSINTer PRO below, or contact us if you believe this is an error",
          ],
          logo: false,
          actions: [
            { title: "Subscribe", href: "/purchase" },
            { title: "Contact Us", href: `mailto:${contactEmail}` },
          ],
        });
      else
        error(403, {
          message: "",
          title:
            "This page is reserved for OSINTer PRO users, and you're not logged in",
          description: [
            "Some of the services from OSINTer are restricted to our paying (or selfhosting) users",
            "As such, you have to be logged in with a OSINTer PRO user to be able to access the following page",
            "Do you already have a user? Login below.",
          ],
          logo: false,
          actions: [
            { title: "Login", href: "/login" },
            { title: "Go to news", href: "/news" },
          ],
        });
  });
};
