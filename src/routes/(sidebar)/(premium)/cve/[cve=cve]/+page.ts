import { PUBLIC_API_BASE } from "$env/static/public";

import type { ArticleBase } from "$shared/types/api";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, params }) => {
  async function getArticles(): Promise<ArticleBase[]> {
    const r = await fetch(
      PUBLIC_API_BASE + "/cves/" + encodeURIComponent(params.cve) + "/articles"
    );

    if (r.ok) {
      return await r.json();
    } else {
      throw new Error("Error when querying CVEs");
    }
  }

  return {
    articles: await getArticles(),
  };
};
