import type { PageLoad } from "./$types";
import type { ArticleBase } from "$shared/types/api";

import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load = (async ({ params, fetch }) => {
  const id = encodeURIComponent(params.cluster_id);

  async function fetchArticles(): Promise<ArticleBase[]> {
    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/cluster/${id}/content?complete=false`
    );

    if (r.ok) {
      return await r.json();
    } else {
      error(r.status, "Error when fetching articles in cluster");
    }
  }

  return {
    articles: await fetchArticles(),
  };
}) satisfies PageLoad;
