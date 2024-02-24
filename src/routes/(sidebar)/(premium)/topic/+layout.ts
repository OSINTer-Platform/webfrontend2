import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
  return {
    customSidebar: true,
    meta: {
      title: "Topics | OSINTer",
      description:
        "Do a deep-dive on topics present in the news cycle, and cut out the noise.",
    },
  };
};
