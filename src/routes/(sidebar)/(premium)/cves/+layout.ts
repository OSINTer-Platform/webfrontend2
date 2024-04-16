import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
  return {
    customSidebar: true,
    meta: {
      title: "CVEs | OSINTer",
      description:
        "Get a list of the recent or trending CVE's and connect them to news articles",
    },
  };
};
