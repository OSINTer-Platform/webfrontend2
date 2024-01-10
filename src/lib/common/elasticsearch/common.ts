import {
  PUBLIC_ELASTIC_ARTICLES_SEARCH,
  PUBLIC_ELASTIC_ARTICLES_KEY,
} from "$env/static/public";

import Client from "@elastic/search-application-client";

export const client = Client(
  "osinter-articles",
  PUBLIC_ELASTIC_ARTICLES_SEARCH,
  PUBLIC_ELASTIC_ARTICLES_KEY,
  {}
);
