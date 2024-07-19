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

  async function getPrice() {
    const prices: { [key: string]: Price } = await fetch(
      `${PUBLIC_API_BASE}/payment/prices`
    ).then((r) => r.json());
    const price: undefined | Price = Object.values(prices).find(
      (price) => price.lookup_key == "pro-month"
    );

    return price;
  }

  const [docs, price] = await Promise.all([getFrontpageStats(), getPrice()]);

  return {
    trendingArticles: docs.articles,
    trendingCVEs: docs.cves,
    trendingClusters: docs.clusters,
    burgerMenu: false,
    topbar: false,
    personalPrice: price,
  };
};
