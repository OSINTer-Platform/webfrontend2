import type { Cluster } from "$shared/types/api";
import { writable, type Writable } from "svelte/store";

import { persisted } from "svelte-persisted-store";

export const readClusters: Writable<{ [key: string]: Cluster }> = persisted(
  "readClusters",
  {},
  { storage: "session" }
);

export const articleSearch = writable("");

export const showClusterGraph = writable(false);
