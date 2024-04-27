import type { LayoutLoad } from "./$types";
import type { FullArticle } from "$shared/types/api";

import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load = (async ({ params, fetch }) => {
  const fetchArticle = async (): Promise<FullArticle> => {
    const r = await fetch(
      `${PUBLIC_API_BASE}/articles/${params.article_id}/content`
    );

    if (!r.ok) {
      if (r.status === 404) {
        error(
          r.status,
          "The requested article unfortuantely wasn't found found"
        );
      }

      error(r.status, "Error when fetching article content.");
    }

    return await r.json();
  };

  const article = await fetchArticle();

  return {
    article,
    meta: {
      title: `${article.title} | OSINTer`,
      description: article.description,
      image: article.image_url,
      type: "article",
    },
  };
}) satisfies LayoutLoad;
