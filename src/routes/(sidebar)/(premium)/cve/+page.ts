import { queryCVEs } from "$lib/common/queryArticles";

import type { CVESEarchQuery } from "$shared/types/api";
import type { PageLoad } from "./$types";

import { derived, writable } from "svelte/store";

export const load: PageLoad = async ({ fetch }) => {
  const cveQuery = writable<CVESEarchQuery>({ limit: 500 });
  const cves = derived(cveQuery, ($cveQuery) =>
    queryCVEs($cveQuery, false, fetch).then(({ documents }) => documents ?? [])
  );

  return {
    cveQuery,
    cves,
  };
};
