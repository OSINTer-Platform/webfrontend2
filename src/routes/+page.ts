import type { TrendingArticleBundle } from "$com/frontpage/types";
import type { PageLoad } from "./$types";
import type { CVEBase, ClusterBase } from "$shared/types/api";
import type { Price } from "$shared/types/stripe";

import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async () => {
  async function getFrontpageStats(): Promise<{
    articles: TrendingArticleBundle[];
    cves: CVEBase[];
    clusters: ClusterBase[];
  }> {
    const r = await fetch(`${PUBLIC_API_BASE}/frontpage`);

    if (!r.ok) error(r.status, "Error when getting frontpage metrics");

    return await r.json();
  }

  async function getPrices() {
    const prices: { [key: string]: Price } = await fetch(
      `${PUBLIC_API_BASE}/payment/prices`
    ).then((r) => r.json());
    const proPrice: undefined | Price = Object.values(prices).find(
      (price) => price.lookup_key == "pro-month"
    );
    const basePrice: undefined | Price = Object.values(prices).find(
      (price) => price.lookup_key == "base-month"
    );

    return { proPrice, basePrice };
  }

  const [docs, prices] = await Promise.all([getFrontpageStats(), getPrices()]);

  return {
    trendingArticles: docs.articles,
    trendingCVEs: docs.cves,
    trendingClusters: docs.clusters,
    burgerMenu: false,
    topbar: false,
    proPrice: prices.proPrice,
    basePrice: prices.basePrice,
  };
};
