import {
  PUBLIC_ELASTIC_ARTICLES_SEARCH,
  PUBLIC_ELASTIC_ARTICLES_KEY,
  PUBLIC_ES_ARTICLE_SEARCH_APP,
} from "$env/static/public";

import Client from "@elastic/search-application-client";

export const client = Client(
  PUBLIC_ES_ARTICLE_SEARCH_APP,
  PUBLIC_ELASTIC_ARTICLES_SEARCH,
  PUBLIC_ELASTIC_ARTICLES_KEY,
  {}
);

export const extractDocHits = (response: any) =>
  response.hits.hits.map((hit: any) => ({
    id: hit._id,
    ...(hit._source as object),
    highlights: hit.highlight,
  }));
