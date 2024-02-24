import type { PageLoad } from "./$types";

export const load = (() => {
  return {
    meta: {
      title: "Sign up | OSINTer",
      description:
        "Signup for OSINTer and experience your new one-stop shop for cybersecurity news",
    },
  };
}) satisfies PageLoad;
