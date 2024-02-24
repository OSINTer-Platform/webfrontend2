import { filterArticles } from "$lib/common/filter";
import { persisted } from "svelte-persisted-store";
import { derived, writable, type Writable, type Readable } from "svelte/store";

import type { FullArticle } from "../types/api";

export const localSearch = writable("");
export const showSimilar = writable(true);

export const fullArticles: Writable<{ [key: string]: FullArticle }> = persisted(
  "fullArticleList",
  {}
);

export const filteredArticles: Readable<FullArticle[]> = derived(
  [fullArticles, localSearch],
  ([$fullArticles, $localSearch]) =>
    filterArticles(Object.values($fullArticles), $localSearch)
);
