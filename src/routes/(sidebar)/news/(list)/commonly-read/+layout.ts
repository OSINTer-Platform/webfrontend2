import { derived, writable, type Writable } from "svelte/store";

import type { LayoutLoad } from "./$types";
import type { ArticleSearchQuery } from "$shared/types/api";
import { queryArticles } from "$lib/common/queryArticles";

export const load = (async ({ fetch }) => {
  const firstDate: Writable<Date | null> = writable(null);
  const lastDate: Writable<Date | null> = writable(null);

  const searchQuery = derived(
    [firstDate, lastDate],
    ([$firstDate, $lastDate]) => {
      const q: ArticleSearchQuery = {
        limit: 1000,
        sort_by: "read_times",
        sort_order: "desc",
      };

      if ($firstDate) q.first_date = $firstDate.toISOString();
      if ($lastDate) q.last_date = $lastDate.toISOString();

      return q;
    }
  );

  const articles = derived(searchQuery, ($searchQuery) =>
    queryArticles($searchQuery, false, fetch).then(
      ({ articles }) => articles ?? []
    )
  );

  return {
    firstDate,
    lastDate,
    searchQuery,
    loadingArticles: articles,
    meta: {
      title: "Commonly read | OSINTer",
      description:
        "Explore the most read articles in OSINTer, and get an insight into what is trending",
    },
  };
}) satisfies LayoutLoad;
