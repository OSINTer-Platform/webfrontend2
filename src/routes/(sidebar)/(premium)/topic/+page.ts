import { PUBLIC_API_BASE } from "$env/static/public";

import type { ClusterBase } from "$shared/types/api";
import type { PageLoad } from "./$types";

import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch, parent }) => {
  async function getClusters(permitted: boolean): Promise<ClusterBase[]> {
    if (!permitted) return []
    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/articles/clusters?complete=false`
    );

    if (r.ok) {
      return await r.json();
    } else {
      throw error(r.status, "Error when fetching cluster list");
    }
  }

  const { user } = await parent()
  const permitted = (user && user.premium > 0) ? true : false

  return {
    clusters: getClusters(permitted),
  };
};
