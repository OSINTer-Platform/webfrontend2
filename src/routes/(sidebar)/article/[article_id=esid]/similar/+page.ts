import { PUBLIC_API_BASE } from "$env/static/public";
import type { ArticleBase } from "$shared/types/api";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  async function fetchSimilarArticles(): Promise<ArticleBase[]> {
    const r = await fetch(
      `${PUBLIC_API_BASE}/articles/${params.article_id}/similar`
    );

    if (r.ok) {
      const articles = await r.json();
      if (articles.length < 1) throw error(404, "No similar articles found");
      return articles;
    } else {
      if (r.status === 404) {
        throw error(
          r.status,
          "The requested article unfortuantely wasn't found found"
        );
      } else {
        throw error(r.status, "Error when fetching article content.");
      }
    }
  }

  return { similarArticles: await fetchSimilarArticles() };
};
