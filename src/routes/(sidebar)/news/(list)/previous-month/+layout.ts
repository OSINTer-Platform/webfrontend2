import { PUBLIC_API_BASE } from "$env/static/public";
import { getMonths } from "$lib/common/math";
import { derived, writable } from "svelte/store";
import type { LayoutLoad } from "./$types";
import type { ArticleBase, ArticleSearchQuery } from "$shared/types/api";

export const load = (async () => {
  const getArticles = async (
    query: ArticleSearchQuery
  ): Promise<ArticleBase[]> => {
    const r = await fetch(`${PUBLIC_API_BASE}/articles/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });
    if (r.ok) {
      return await r.json();
    } else {
      console.error(`Error when fetching articles with query "${query}"`);
      return [];
    }
  };

  const getApiSearchQuery = (
    firstDate: Date,
    lastDate: Date
  ): ArticleSearchQuery => ({
    limit: 10000,
    sort_by: "publish_date",
    sort_order: "desc",
    first_date: firstDate.toISOString(),
    last_date: lastDate.toISOString(),
  });

  const readableMonths = getMonths(new Date(2022, 1));
  const months = readableMonths.map(({ name, firstDate, lastDate }) => ({
    name: name,
    id: firstDate.toLocaleString("default", { dateStyle: "short" }),
    query: getApiSearchQuery(firstDate, lastDate),
  }));

  const selectedMonth = writable(months[0]);

  const articles = derived(selectedMonth, ($currentMonth) =>
    getArticles($currentMonth.query)
  );

  return {
    months,
    selectedMonth: selectedMonth,
    loadingArticles: articles,
    meta: {
      title: "Previous months | OSINTer",
      description:
        "Go back in time using OSINTer and get articles from specific months",
    },
  };
}) satisfies LayoutLoad;
