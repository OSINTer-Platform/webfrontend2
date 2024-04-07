import { PUBLIC_API_BASE } from "$env/static/public";
import { getMonths } from "$lib/common/math";
import { writable } from "svelte/store";
import type { LayoutLoad } from "./$types";

export const load = (async () => {
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

  const monthLookup = months.reduce(
    (lookupTable: { [key: string]: any }, month) => (
      (lookupTable[month.id] = month), lookupTable
    ),
    {}
  );

  return {
    months,
    monthLookup,
    currentMonth: writable(months[0].id),
    meta: {
      title: "Previous months | OSINTer",
      description:
        "Go back in time using OSINTer and get articles from specific months",
    },
  };
}) satisfies LayoutLoad;
