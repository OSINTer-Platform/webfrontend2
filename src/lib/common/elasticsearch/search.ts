import type { ArticleBase, FullArticle, SearchQuery } from "$shared/types/api";

import { client } from "./common";

type NonEmptyArray<T> = [T, ...T[]];

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
  }
) {
  const verifyContent = (v: any) =>
    v && (v.length !== undefined ? v.length > 0 : true);
  const request = client();

  Object.entries(query).forEach(([k, v]) => {
    if (verifyContent(v)) request.addParameter(k, v);
  });

  Object.entries(options).forEach(([k, v]) => {
    request.addParameter(k, v);
  });

  return request;
}

export const getFullArticles = (query: SearchQuery): Promise<FullArticle[]> =>
  searchArticles(query, {
    include_fields: [...BaseArticleFields, "formatted_content", "content"],
  });

export const getBaseArticles = (query: SearchQuery): Promise<ArticleBase[]> =>
  searchArticles(query, {
    include_fields: BaseArticleFields,
  });

export async function searchArticles<K extends keyof FullArticle>(
  query: SearchQuery,
  options: {
    include_fields: NonEmptyArray<K>;
    search_after?: NonEmptyArray<unknown>;
  }
): Promise<Pick<FullArticle, K | "id">[]> {
  if (query.limit > 10000 || query.limit === 0)
    return await largeSearch(query, options.include_fields);

  const response = await createRequest(query, options).search();

  return response.hits.hits.map((hit) => hit._source) as any[];
}

async function largeSearch<K extends keyof FullArticle>(
  query: SearchQuery,
  include_fields: NonEmptyArray<K>
): Promise<Pick<FullArticle, K | "id">[]> {
  const articles: Pick<FullArticle, K | "id">[] = [];
  let priorLimit = query.limit;
  let search_after: { search_after?: NonEmptyArray<unknown> } = {};

  while (true) {
    const limit = priorLimit >= 10000 || priorLimit === 0 ? 10000 : priorLimit;
    const limitedQuery = { ...query, limit };
    const request = createRequest(limitedQuery, {
      include_fields,
      sort_tiebreaker: true,
      ...search_after,
    });
    const response = await request.search();
    const results = response.hits.hits.map((hit) => ({
      id: hit._id,
      ...(hit._source as object),
    })) as Pick<FullArticle, K | "id">[];

    articles.push(...results);

    if (results.length < 10000) break;

    search_after = {
      search_after: (response.hits.hits as any[]).at(-1)["sort"],
    };

    priorLimit = priorLimit > 0 ? priorLimit - 10000 : priorLimit;
  }

  return articles;
}
