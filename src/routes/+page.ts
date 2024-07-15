import type { TrendingArticleBundle } from "$com/frontpage/types";
import type { PageLoad } from "./$types";
import type { CVEBase, ClusterBase } from "$shared/types/api";

import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async () => {
  const r = await fetch(`${PUBLIC_API_BASE}/frontpage`);

  if (!r.ok) error(r.status, "Error when getting frontpage metrics");

  const docs: {
    articles: TrendingArticleBundle[];
    cves: CVEBase[];
    clusters: ClusterBase[];
  } = await r.json();

  return {
    trendingArticles: docs.articles,
    trendingCVEs: docs.cves,
    trendingClusters: docs.clusters,
    burgerMenu: false,
    topbar: false,
  };
};
