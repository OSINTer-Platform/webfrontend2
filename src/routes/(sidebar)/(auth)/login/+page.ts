import type { PageLoad } from "./$types";

export const load = (({ url }) => {
  return {
    msg: url.searchParams.get("msg"),
    meta: {
      title: "Log in | OSINTer",
      description: "Log in to your one-stop shop for cybersecurity news",
    },
  };
}) satisfies PageLoad;
