import type { PageLoad } from "../$types";
import type { ClusterBase } from "$shared/types/api";

import { getDashboardMetrics } from "$lib/common/elasticsearch/aggregations";
import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ parent, fetch }) => {
  const { startDate } = await parent();

  async function getClusters(): Promise<ClusterBase[]> {
    const r = await fetch(`${PUBLIC_API_BASE}/ml/clusters?complete=false`);

    if (r.ok) {
      return await r.json();
    } else {
      throw error(r.status, "Error when fetching cluster list");
    }
  }

  const [metrics, clusters] = await Promise.all([
    getDashboardMetrics(startDate, new Date()),
    getClusters(),
  ]);

  return {
    metrics,
    clusters,
  };
};
