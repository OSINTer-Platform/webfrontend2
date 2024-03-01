import type { PageLoad } from "./$types";

export const load = (async ({ url }) => {
  const etc = url.searchParams.get("etc");

  return {
    etc: etc && Date.parse(etc) ? new Date(Date.parse(etc)) : null,
  };
}) satisfies PageLoad;
