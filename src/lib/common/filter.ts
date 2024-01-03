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
    articles = articles.filter((article) => searchInArticle(article, search));
  }

  if (ids.length > 0) {
    articles = articles.filter(
      (article) => ids.includes(article.id) == includeIds
    );
  }

  return articles;
}

export const searchInArticle = (
  article: {
    title: string;
    description: string;
    source: string;
    author?: string | null;
    content?: string;
  },
  keyword: string,
  deep: boolean = true
) => {
  keyword = keyword.toLowerCase();

  const search = (content: string) =>
    content.toLowerCase().indexOf(keyword) != -1;

  if (
    search(article.title) ||
    search(article.description) ||
    search(article.source)
  )
    return true;
  else if (!deep) return false;

  if ("content" in article && article.content && search(article.content))
    return true;
  if ("author" in article && article.author && search(article.author))
    return true;
};

export const searchInCluster = (
  cluster: { title: string; description: string; summary: string },
  keyword: string
) => {
  keyword = keyword.toLowerCase();
  const search = (content: string) =>
    content.toLowerCase().indexOf(keyword) != -1;

  return (
    search(cluster.title) ||
    search(cluster.description) ||
    search(cluster.summary)
  );
};
