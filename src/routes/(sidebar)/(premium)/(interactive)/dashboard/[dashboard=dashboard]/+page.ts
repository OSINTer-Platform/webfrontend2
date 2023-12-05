import { PUBLIC_API_BASE } from "$env/static/public";

import type { ClusterBase } from "$shared/types/api";
import type { PageLoad } from "./$types";

import { error } from "@sveltejs/kit";
import type { Dashboards } from "$shared/types/internal";

export const load: PageLoad = async ({ fetch, params }) => {
  async function getClusters(): Promise<ClusterBase[]> {
    const r = await fetch(`${PUBLIC_API_BASE}/ml/clusters?complete=false`);

    if (r.ok) {
      return await r.json();
    } else {
      throw error(r.status, "Error when fetching cluster list");
    }
  }

  const dashboard = params.dashboard as Dashboards;

  return {
    dashboard,
    customSidebar: true,
    topbar: false,
    clusters: getClusters(),
  };
};
