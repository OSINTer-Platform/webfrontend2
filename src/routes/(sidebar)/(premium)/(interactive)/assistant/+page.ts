import type { PageLoad } from "./$types";

export const load = (() => {
  return {
    meta: {
      title: "Assistant | OSINTer",
      description:
        "Get assistance in digesting the most recent cybersecurity news",
    },
  };
}) satisfies PageLoad;
