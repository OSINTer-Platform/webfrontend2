import { error } from "@sveltejs/kit";
import { get } from "svelte/store";
import { contactEmail } from "$shared/config";

import type { LayoutLoad } from "./$types";
import { PUBLIC_PURCHASE_AVAILABLE } from "$env/static/public";

export const load: LayoutLoad = async ({ parent }) => {
  const { user, checkAuthorization } = await parent();
  const userContent = get(user);
  const authorizer = get(checkAuthorization);

  if (authorizer("articles")) return;

  if (!PUBLIC_PURCHASE_AVAILABLE)
    error(403, {
      message: "",
      title: "This page is reserved for beta-testers and B2B partners",
      description: [
        "We are at OSINTer currently beta-testing new features",
        "Do you want early access?",
        "Contact us below",
      ],
      logo: false,
    });
  else if (userContent)
    error(403, {
      message: "",
      title:
        "This page is reserved for OSINTer Base users, and you're not subscribed",
      description: [
        "Some of the services from OSINTer are restricted to our paying (or selfhosting) users",
        "As such, you have to be subscribed to a OSINTer Base plan to access the following page",
        "Signup for OSINTer Base below, or contact us if you believe this is an error",
      ],
      logo: false,
      actions: [
        { title: "Subscribe", href: "/purchase?plan=base" },
        { title: "Contact Us", href: `mailto:${contactEmail}` },
      ],
    });
  else
    error(403, {
      message: "",
      title:
        "This page is reserved for OSINTer Base users, and you're not logged in",
      description: [
        "Some of the services from OSINTer are restricted to our paying (or selfhosting) users",
        "As such, you have to be logged in with a OSINTer Base user to be able to access the following page",
        "Do you already have a user? Login below.",
      ],
      logo: false,
      actions: [
        {
          title: "Login",
          href: `/login?next=${encodeURIComponent("/purchase?plan=base")}`,
        },
        {
          title: "Signup",
          href: `/signup?next=${encodeURIComponent("/purchase?plan=base")}`,
        },
      ],
    });
};
