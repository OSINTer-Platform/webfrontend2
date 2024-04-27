import { PUBLIC_API_BASE } from "$env/static/public";
import type { ArticleBase } from "$shared/types/api";

export async function queryArticlesById(
  ids: string[],
  sort: boolean,
  limit: number = 10000,
  fetchFn = fetch
): Promise<ArticleBase[]> {
  async function query() {
    const r = await fetchFn(
      `${PUBLIC_API_BASE}/articles/search?complete=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit,
          ids,
        }),
      }
    );
    return r.ok ? await r.json() : [];
  }

  if (ids.length < 1) return [];

  const articles: ArticleBase[] = await query();

  if (sort)
    articles.sort(function (a, b) {
      return ids.indexOf(a.id) - ids.indexOf(b.id);
    });

  return articles;
}
