import type {
  ArticleSearchQuery,
  ArticleSortBy,
  CVEDateField,
  CVESEarchQuery,
  CVESortBy,
  SortOrder,
} from "$shared/types/api";

export function articleSearchQueryFromUrl(
  params: URLSearchParams
): ArticleSearchQuery {
  const limit = params.get("limit");
  return {
    limit: limit ? parseInt(limit) : 200,

    sort_by: (params.get("sort_by") as ArticleSortBy) || undefined,
    sort_order: (params.get("sort_order") as SortOrder) || undefined,

    search_term: params.get("search_term") || undefined,
    highlight: Boolean(params.get("highlight")),

    first_date: params.get("first_date") || undefined,
    last_date: params.get("last_date") || undefined,

    sources: params.getAll("sources"),
    ids: params.getAll("ids"),
  };
}

export function CVESearchQueryFromUrl(params: URLSearchParams): CVESEarchQuery {
  const limit = params.get("limit");
  return {
    limit: limit ? parseInt(limit) : 200,

    sort_by: (params.get("sort_by") as CVESortBy) || undefined,
    sort_order: (params.get("sort_order") as SortOrder) || undefined,

    search_term: params.get("search_term") || undefined,
    highlight: Boolean(params.get("highlight")),

    first_date: params.get("first_date") || undefined,
    last_date: params.get("last_date") || undefined,
    date_field: (params.get("date_field") as CVEDateField) || undefined,

    cves: params.getAll("sources"),
    ids: params.getAll("ids"),
  };
}

export function toUrl(q: ArticleSearchQuery | CVESEarchQuery): string {
  const urlElements: string[] = [];

  function append(k: string | number | boolean, v: string | number | boolean) {
    if (v !== undefined) {
      urlElements.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  }

  Object.entries(q).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((subV) => append(k, subV));
    } else {
      append(k, v);
    }
  });

  return urlElements.join("&");
}

// Filter empty arrays as backend will assume that explicitly set empty array means that the search should match nothing
export function cleanQuery<T extends ArticleSearchQuery | CVESEarchQuery>(
  q: T
): T {
  return Object.fromEntries(
    Object.entries(q).filter(([_, v]) => !Array.isArray(v) || v.length > 0)
  ) as T;
}

export const createSearchFromTag = (tag: string, highlight = true) =>
  `/news/search?sort_by=publish_date&highlight=${highlight}&search_term=${encodeURIComponent(
    tag
  )}`;
