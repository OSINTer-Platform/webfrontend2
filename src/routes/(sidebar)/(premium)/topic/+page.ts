import { PUBLIC_API_BASE } from "$env/static/public";

import type { ClusterBase } from "$shared/types/api";
import type { PageLoad } from "./$types";

import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch }) => {
  async function getClusters(): Promise<ClusterBase[]> {
    const r = await fetch(`${PUBLIC_API_BASE}/ml/clusters?complete=false`);

    if (r.ok) {
      return await r.json();
    } else {
      error(r.status, "Error when fetching cluster list");
    }
  }

  return {
    clusters: await getClusters(),
  };
};
