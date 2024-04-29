import { getMonths } from "$lib/common/math";
import { derived, writable } from "svelte/store";
import { queryArticles } from "$lib/common/queryArticles";
import type { LayoutLoad } from "./$types";
import type { ArticleSearchQuery } from "$shared/types/api";

export const load = (async ({ fetch }) => {
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
    queryArticles($currentMonth.query, false, fetch).then(
      ({ articles }) => articles ?? []
    )
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
