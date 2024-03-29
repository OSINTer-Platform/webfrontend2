import type { SearchQuery, SortBy, SortOrder } from "$shared/types/api";

export function fromUrl(params: URLSearchParams): SearchQuery {
  const limit = params.get("limit");
  return {
    limit: limit ? parseInt(limit) : 200,

    sort_by: (params.get("sort_by") as SortBy) || undefined,
    sort_order: (params.get("sort_order") as SortOrder) || undefined,

    search_term: params.get("search_term") || undefined,
    semantic_search: params.get("semantic_search") || undefined,
    highlight: Boolean(params.get("highlight")),

    first_date: params.get("first_date") || undefined,
    last_date: params.get("last_date") || undefined,

    sources: params.getAll("sources"),
    ids: params.getAll("ids"),
  };
}

export function toUrl(q: SearchQuery): string {
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
