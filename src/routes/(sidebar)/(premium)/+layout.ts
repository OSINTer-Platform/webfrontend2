import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent }) => {
  const { user } = await parent();

  if (!user || !(user.premium > 0))
    throw error(401, {
      message: "",
      title: "This page is reserved for beta-testers and B2B partners.",
      description: [
        "We are at OSINTer currently beta-testing new features",
        "Do you want early access?",
        "Contact us below",
      ],
      logo: false,
    });
};
