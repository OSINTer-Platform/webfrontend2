import { PUBLIC_API_BASE } from "$env/static/public";
import { derived, writable, type Writable } from "svelte/store";

import type { LayoutLoad } from "./$types";
import type { ArticleBase, ArticleSearchQuery } from "$shared/types/api";

export const load = (async () => {
  const getArticles = async (
    searchQuery: ArticleSearchQuery
  ): Promise<ArticleBase[]> => {
    const r = await fetch(`${PUBLIC_API_BASE}/articles/search?complete=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchQuery),
    });
    if (r.ok) {
      return await r.json();
    } else {
      console.error(
        `Error when fetching articles from with query "${searchQuery}"`
      );
      return [];
    }
  };

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
    getArticles($searchQuery)
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
