import type { Cluster } from "$shared/types/api";
import { writable, type Writable } from "svelte/store";

import { persisted } from "svelte-persisted-store";

export const readCVEs: Writable<{ [key: string]: Cluster }> = persisted(
  "readCVEs",
  {},
  { storage: "session" }
);

export const cveSearch = writable("");
export const articleSearch = writable("");
export const showCVEDetails = writable(false);
