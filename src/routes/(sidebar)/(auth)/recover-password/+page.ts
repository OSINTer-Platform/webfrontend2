import type { PageLoad } from "./$types";

export const load = (() => {
  return {
    meta: {
      title: "Recover | OSINTer",
      description: "Forgotten your password for OSINTer? Recover it here.",
    },
  };
}) satisfies PageLoad;
