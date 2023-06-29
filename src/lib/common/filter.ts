import type { ArticleBase } from "$shared/types/api";

/**
 * includeIds control whether to INCLUDE or EXCLUDE articles with id contained in ids param
 */
export function filterArticles<T extends ArticleBase>(
  articles: T[],
  search: string,
  ids: string[] = [],
  includeIds: boolean = false
): T[] {
  search = search.toLowerCase();

  if (search.length > 0) {
    articles = articles.filter((article) =>
      Object.values(article).some((field) =>
        field?.toLowerCase?.().includes?.(search)
      )
    );
  }

  if (ids.length > 0) {
    articles = articles.filter(
      (article) => ids.includes(article.id) == includeIds
    );
  }

  return articles;
}
