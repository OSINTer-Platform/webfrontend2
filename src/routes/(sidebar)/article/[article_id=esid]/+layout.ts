import type { LayoutLoad } from "./$types";

import type { FullArticle } from "$shared/types/api";

import { get } from "svelte/store";
import { fullArticles } from "$state/storedArticles";
import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load = (async ({ params, fetch }) => {
  const fullArticleList = get(fullArticles);

  const fetchContent = async (): Promise<FullArticle> => {
    if (params.article_id in fullArticleList) {
      return fullArticleList[params.article_id];
    }

    const r = await fetch(
      `${PUBLIC_API_BASE}/articles/${params.article_id}/content`
    );

    if (!r.ok) {
      if (r.status === 404) {
        throw error(
          r.status,
          "The requested article unfortuantely wasn't found found"
        );
      }

      throw error(r.status, "Error when fetching article content.");
    }

    const article = await r.json();

    fullArticles.update((list) => {
      list[params.article_id] = article;
      return list;
    });

    return article;
  };

  const article = await fetchContent();

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
