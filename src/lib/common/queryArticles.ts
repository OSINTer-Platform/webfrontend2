import { PUBLIC_API_BASE } from "$env/static/public";
import type { ArticleBase, ArticleSearchQuery } from "$shared/types/api";
import { cleanQuery } from "./searchQuery";
import { sortDocumentsById } from "./sort";

export async function queryArticlesById(
  ids: string[],
  sort: boolean,
  limit: number = 10000,
  fetchFn = fetch
): Promise<ArticleBase[]> {
  if (ids.length < 1) return [];

  const articles = await queryArticles({ limit, ids }, false, fetchFn).then(
    ({ articles }) => articles ?? []
  );

  if (sort) return sortDocumentsById(ids, articles, (a) => a.id);
  return articles;
}

export async function queryArticles(
  query: ArticleSearchQuery,
  complete = false,
  fetchFn = fetch
): Promise<{ articles: ArticleBase[] | null; response: Response }> {
  const r = await fetchFn(
    `${PUBLIC_API_BASE}/articles/search?complete=${encodeURIComponent(
      complete
    )}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanQuery(query)),
    }
  );
  return { articles: r.ok ? await r.json() : null, response: r };
}
