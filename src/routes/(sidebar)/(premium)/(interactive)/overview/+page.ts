import type { PageLoad } from "./$types";
import type { ArticleCategories, ClusterBase } from "$shared/types/api";

import { PUBLIC_API_BASE } from "$env/static/public";
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

  const fetchCategories = async (): Promise<ArticleCategories> => {
    const r = await fetch(`${PUBLIC_API_BASE}/articles/categories`);

    if (r.ok) {
      return await r.json();
    } else {
      error(r.status, "Error when fetching categories for articles.");
    }
  };

  const [sourceCategories, clusters] = await Promise.all([
    fetchCategories(),
    getClusters(),
  ]);

  return {
    sourceCategories,
    clusters,
    meta: {
      title: "Overview | OSINTer",
      description:
        "Use our map-like article-mapping to do a deep-dive on specific topics",
    },
  };
};
