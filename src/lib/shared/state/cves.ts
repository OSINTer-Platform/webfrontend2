import { writable } from "svelte/store";

import { persisted } from "svelte-persisted-store";
import { documentCache, setLike } from "$lib/common/customStores";
import { queryCVEsById } from "$lib/common/queryArticles";

export const readCVEIds = setLike(persisted("readCVEIds", [] as string[]));
export const readCVEs = documentCache(
  (ids: string[], sort: boolean) => queryCVEsById(ids, sort, true),
  readCVEIds
);

export const cveSearch = writable("");
export const articleSearch = writable("");
export const showCVEDetails = writable(false);
