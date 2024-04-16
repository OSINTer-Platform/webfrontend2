import { PUBLIC_API_BASE } from "$env/static/public";

import type { CVEBase, CVESEarchQuery } from "$shared/types/api";
import type { PageLoad } from "./$types";

import { derived, writable } from "svelte/store";

export const load: PageLoad = async ({ fetch }) => {
  async function getCVEs(q: CVESEarchQuery): Promise<CVEBase[]> {
    const r = await fetch(`${PUBLIC_API_BASE}/cves/search`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(q),
    });

    if (r.ok) {
      return await r.json();
    } else {
      throw new Error("Error when querying CVEs");
    }
  }

  const cveQuery = writable<CVESEarchQuery>({ limit: 500 });
  const cves = derived(cveQuery, ($cveQuery) => getCVEs($cveQuery));

  return {
    cveQuery,
    cves,
  };
};
