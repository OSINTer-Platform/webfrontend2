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

  return false;
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

export const searchInCVE = (
  cve: { title: string; description: string },
  keyword: string
) => {
  keyword = keyword.toLowerCase();
  const search = (content: string) =>
    content.toLowerCase().indexOf(keyword) != -1;

  return search(cve.title) || search(cve.description);
};

export const hasHighlights = (
  documents: { highlights?: { [key: string]: string[] } }[] | undefined
): { highlights: boolean; expandable: boolean } => {
  if (!Array.isArray(documents))
    return { highlights: false, expandable: false };

  const highlights = documents.some(
    (a) => a.highlights && Object.values(a.highlights).some((v) => v.length > 0)
  );

  if (!highlights) return { highlights: false, expandable: false };

  const expandable = documents.some(
    (a) =>
      a.highlights &&
      Object.entries(a.highlights).some(
        ([k, v]) => ["content", "summary"].includes(k) && v.length > 0
      )
  );

  return { highlights, expandable };
};

export const hasSummary = (documents: { summary?: string }[] | undefined) =>
  documents?.some((a) => a.summary && a.summary.length > 0) ?? false;
