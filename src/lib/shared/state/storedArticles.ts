import { filterArticles } from "$lib/common/filter";
import { persisted } from "svelte-persisted-store";
import { derived, writable, type Writable, type Readable } from "svelte/store";

import type { Article } from "../types/api";

export const localSearch = writable("");
export const showSimilar = writable(true);

export const fullArticles: Writable<{ [key: string]: Article }> = persisted(
  "fullArticleList",
  {}
);

export const filteredArticles: Readable<Article[]> = derived(
  [fullArticles, localSearch],
  ([$fullArticles, $localSearch]) =>
    filterArticles(Object.values($fullArticles), $localSearch)
);
