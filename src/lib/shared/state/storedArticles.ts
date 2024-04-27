import { persisted } from "svelte-persisted-store";
import { writable, type Writable } from "svelte/store";

import type { FullArticle } from "../types/api";

export const similarSearch = writable("");
export const showSimilar = writable(true);

export const fullArticles: Writable<{ [key: string]: FullArticle }> = persisted(
  "fullArticleList",
  {}
);
