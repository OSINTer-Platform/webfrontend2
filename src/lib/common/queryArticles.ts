import { PUBLIC_API_BASE } from "$env/static/public";
import type {
  ArticleBase,
  ArticleSearchQuery,
  CVEBase,
  CVESEarchQuery,
  Cluster,
  ClusterBase,
  FullArticle,
  FullCVE,
} from "$shared/types/api";
import { cleanQuery } from "./searchQuery";
import { sortDocumentsById } from "./sort";

export function queryArticlesById(
  ids: string[],
  sort: boolean,
  complete?: false,
  limit?: number,
  fetchFn?: typeof fetch
): Promise<ArticleBase[]>;
export function queryArticlesById(
  ids: string[],
  sort: boolean,
  complete?: true,
  limit?: number,
  fetchFn?: typeof fetch
): Promise<FullArticle[]>;
export function queryArticlesById(
  ids: string[],
  sort: boolean,
  complete = false,
  limit: number = 10000,
  fetchFn = fetch
): Promise<ArticleBase[] | FullArticle[]> {
  return queryDocumentsById(
    ids,
    sort,
    limit,
    complete,
    "/articles/search",
    fetchFn
  );
}

export function queryCVEsById(
  ids: string[],
  sort: boolean,
  complete?: false,
  limit?: number,
  fetchFn?: typeof fetch
): Promise<CVEBase[]>;
export function queryCVEsById(
  ids: string[],
  sort: boolean,
  complete?: true,
  limit?: number,
  fetchFn?: typeof fetch
): Promise<FullCVE[]>;
export function queryCVEsById(
  ids: string[],
  sort: boolean,
  complete = false,
  limit: number = 10000,
  fetchFn = fetch
): Promise<CVEBase[] | FullCVE[]> {
  return queryDocumentsById(
    ids,
    sort,
    limit,
    complete,
    "/cves/search",
    fetchFn
  );
}

export function queryClustersById(
  ids: string[],
  sort: boolean,
  complete?: false,
  limit?: number,
  fetchFn?: typeof fetch
): Promise<ClusterBase[]>;
export function queryClustersById(
  ids: string[],
  sort: boolean,
  complete?: true,
  limit?: number,
  fetchFn?: typeof fetch
): Promise<Cluster[]>;
export function queryClustersById(
  ids: string[],
  sort: boolean,
  complete = false,
  limit: number = 10000,
  fetchFn = fetch
): Promise<ClusterBase[] | Cluster[]> {
  return queryDocumentsById(
    ids,
    sort,
    limit,
    complete,
    "/ml/clusters/search",
    fetchFn
  );
}

export function queryArticles(
  query: ArticleSearchQuery,
  complete?: false,
  fetchFn?: typeof fetch
): Promise<{ documents: ArticleBase[] | null; response: Response }>;
export function queryArticles(
  query: ArticleSearchQuery,
  complete?: true,
  fetchFn?: typeof fetch
): Promise<{ documents: FullArticle[] | null; response: Response }>;
export function queryArticles(
  query: ArticleSearchQuery,
  complete = false,
  fetchFn = fetch
): Promise<{
  documents: ArticleBase[] | FullArticle[] | null;
  response: Response;
}> {
  return queryDocuments(
    cleanQuery(query),
    "/articles/search",
    complete,
    fetchFn
  );
}

export function queryCVEs(
  query: CVESEarchQuery,
  complete?: false,
  fetchFn?: typeof fetch
): Promise<{ documents: CVEBase[] | null; response: Response }>;
export function queryCVEs(
  query: CVESEarchQuery,
  complete?: true,
  fetchFn?: typeof fetch
): Promise<{ documents: FullCVE[] | null; response: Response }>;
export function queryCVEs(
  query: CVESEarchQuery,
  complete = false,
  fetchFn = fetch
): Promise<{ documents: CVEBase[] | FullCVE[] | null; response: Response }> {
  return queryDocuments(cleanQuery(query), "/cves/search", complete, fetchFn);
}

async function queryDocumentsById(
  ids: string[],
  sort: boolean,
  limit: number,
  complete: boolean,
  searchRoute: string,
  fetchFn: typeof fetch
): Promise<any[]> {
  if (ids.length < 1) return [];

  const documents = await queryDocuments(
    { limit, ids },
    searchRoute,
    complete,
    fetchFn
  ).then(({ documents }) => documents ?? []);

  if (sort) return sortDocumentsById(ids, documents, (a) => a.id);
  return documents;
}

async function queryDocuments(
  query: { [key: string]: any },
  searchRoute: string,
  complete: boolean,
  fetchFn: typeof fetch
): Promise<{ documents: any[] | null; response: Response }> {
  const r = await fetchFn(
    `${PUBLIC_API_BASE}${searchRoute}?complete=${encodeURIComponent(complete)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    }
  );

  return { documents: r.ok ? await r.json() : null, response: r };
}
