import { PUBLIC_API_BASE } from "$env/static/public";
import { getMonths } from "$lib/common/math";
import { derived, writable } from "svelte/store";
import type { LayoutLoad } from "./$types";
import type { ArticleBase } from "$shared/types/api";

export const load = (async () => {
  const getArticles = async (url: URL): Promise<ArticleBase[]> => {
    const r = await fetch(url);
    if (r.ok) {
      return await r.json();
    } else {
      console.error(`Error when fetching articles from url "${url}"`);
      return [];
    }
  };

  const getApiSearchUrl = (firstDate: Date, lastDate: Date) => {
    const params = new URLSearchParams({
      limit: "10000",
      sort_by: "publish_date",
      sort_order: "desc",
      complete: "false",
      first_date: firstDate.toISOString(),
      last_date: lastDate.toISOString(),
    });

    return new URL(`${PUBLIC_API_BASE}/articles/search?${params.toString()}`);
  };

  const readableMonths = getMonths(new Date(2022, 1));
  const months = readableMonths.map(({ name, firstDate, lastDate }) => ({
    name: name,
    id: firstDate.toLocaleString("default", { dateStyle: "short" }),
    url: getApiSearchUrl(firstDate, lastDate),
  }));

  const selectedMonth = writable(months[0]);

  const articles = derived(selectedMonth, ($currentMonth) =>
    getArticles($currentMonth.url)
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
