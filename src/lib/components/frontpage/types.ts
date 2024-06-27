import type { SpecificArticle } from "$lib/common/elasticsearch/search";

export type TrendingArticleBundle = {
  tag: string;
  count: number;
  articles: SpecificArticle<"title" | "url" | "image_url">[];
};
