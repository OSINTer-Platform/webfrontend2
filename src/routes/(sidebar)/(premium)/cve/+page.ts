import { queryCVEs } from "$lib/common/queryArticles";
import { derived, writable } from "svelte/store";

import type { PageLoad } from "./$types";
import type { RequiredCVESEarchQuery } from "./types";

export const load: PageLoad = async ({ fetch }) => {
  const cveQuery = writable<RequiredCVESEarchQuery>({
    limit: 500,
    date_field: "publish_date",
    sort_by: "document_count",
    sort_order: "desc",
    highlight: true,
  });
  const cves = derived(cveQuery, ($cveQuery) =>
    queryCVEs($cveQuery, false, fetch).then(({ documents }) => documents ?? [])
  );

  return {
    cveQuery,
    cves,
  };
};
