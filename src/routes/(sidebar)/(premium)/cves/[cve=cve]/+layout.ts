import { PUBLIC_API_BASE } from "$env/static/public";

import type { FullCVE } from "$shared/types/api";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, params }) => {
  async function getCVE(): Promise<FullCVE> {
    const r = await fetch(
      PUBLIC_API_BASE +
        "/cves/" +
        encodeURIComponent(params.cve) +
        "?complete=true"
    );

    if (r.ok) {
      return await r.json();
    } else if (r.status == 404) {
      error(404, "CVE was not found in our database");
    } else {
      throw new Error("Error when querying CVEs");
    }
  }

  return {
    cve: await getCVE(),
  };
};
