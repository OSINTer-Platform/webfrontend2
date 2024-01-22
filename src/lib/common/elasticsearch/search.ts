import type {
  Article,
  ArticleBase,
  FullArticle,
  SearchQuery,
} from "$shared/types/api";

import { client, extractDocHits } from "./common";

type NonEmptyArray<T> = [T, ...T[]];
type SpecificArticle<K extends keyof FullArticle> = Pick<FullArticle, K> &
  Article;

const BaseArticleFields: NonEmptyArray<keyof ArticleBase> = [
  "title",
  "description",
  "url",
  "profile",
  "source",
  "image_url",
  "author",
  "publish_date",
  "inserted_at",
  "tags",
  "similar",
  "summary",
  "ml",
  "read_times",
];

function createRequest(
  query: SearchQuery,
  options: {
    include_fields?: NonEmptyArray<string>;
    search_after?: NonEmptyArray<unknown>;
    sort_tiebreaker?: boolean;
    filters?: Array<{ [key: string]: any }>;
  }
) {
  const verifyContent = (v: any) =>
    v && (v.length !== undefined ? v.length > 0 : true);
  const request = client();

  Object.entries(query).forEach(([k, v]) => {
    if (verifyContent(v)) request.addParameter(k, v);
  });

  Object.entries(options).forEach(([k, v]) => {
    // Convert search_after elements to string, to avoid comma numbers
    // See https://discuss.elastic.co/t/bug-when-using-list-with-comma-number-in-elastic-search-template-tojson/351274
    if (k === "search_after" && typeof v === "object") {
      request.addParameter(
        k,
        v.map((el) => `${el}`)
      );
    } else {
      request.addParameter(k, v);
    }
  });

  return request;
}

export const getFullArticles = (
  query: SearchQuery,
  options?: { filters?: Array<{ [key: string]: any }> }
): Promise<FullArticle[]> =>
  searchArticles(query, {
    ...options,
    include_fields: [...BaseArticleFields, "formatted_content", "content"],
  });

export const getBaseArticles = (
  query: SearchQuery,
  options?: { filters?: Array<{ [key: string]: any }> }
): Promise<ArticleBase[]> => {
  return searchArticles(query, {
    ...options,
    include_fields: BaseArticleFields,
  });
};

export async function searchArticles<K extends keyof FullArticle>(
  query: SearchQuery,
  options: {
    include_fields: NonEmptyArray<K>;
    search_after?: NonEmptyArray<unknown>;
    filters?: Array<{ [key: string]: any }>;
  }
): Promise<SpecificArticle<K>[]> {
  if (query.limit > 10000 || query.limit === 0)
    return await largeSearch(query, options);

  const response = await createRequest(query, options).search();

  return extractDocHits(response) as any[];
}

async function largeSearch<K extends keyof FullArticle>(
  query: SearchQuery,
  options: {
    include_fields: NonEmptyArray<K>;
    filters?: Array<{ [key: string]: any }>;
  }
): Promise<SpecificArticle<K>[]> {
  const articles: SpecificArticle<K>[] = [];
  let priorLimit = query.limit;
  let search_after: { search_after?: NonEmptyArray<unknown> } = {};

  while (true) {
    const limit = priorLimit >= 10000 || priorLimit === 0 ? 10000 : priorLimit;
    const limitedQuery = { ...query, limit };
    const request = createRequest(limitedQuery, {
      ...options,
      sort_tiebreaker: true,
      ...search_after,
    });
    const response = await request.search();
    const results = extractDocHits(response) as SpecificArticle<K>[];

    articles.push(...results);

    if (results.length < 10000) break;

    search_after = {
      search_after: (response.hits.hits as any[]).at(-1)["sort"],
    };

    priorLimit = priorLimit > 0 ? priorLimit - 10000 : priorLimit;
  }

  return articles;
}
