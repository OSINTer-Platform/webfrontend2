import type { LayoutLoad } from "./$types";
import type { Cluster } from "$shared/types/api";

import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";
import { readClusters } from "$shared/state/topics";

export const load = (({ params, fetch }) => {
  const id = encodeURIComponent(params.cluster_id);

  async function fetchCluster(): Promise<Cluster> {
    const r = await fetch(`${PUBLIC_API_BASE}/ml/articles/cluster/${id}`);

    if (r.ok) {
      const cluster = await r.json();

      readClusters.update((readClusters) => {
        readClusters[id] = cluster;
        return readClusters;
      });

      return cluster;
    } else {
      throw error(r.status, "Error when fetching details for cluster");
    }
  }

  return {
    cluster: fetchCluster(),
  };
}) satisfies LayoutLoad;
