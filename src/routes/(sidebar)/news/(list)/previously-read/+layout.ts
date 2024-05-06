import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
  return {
    customSidebar: true,
    meta: {
      title: "Previously read | OSINTer",
      description: "List of the articles you have recently viewed in OSINTer",
    },
  };
};
