import type { SearchQuery } from "./types/api";
import type { ArticleListRender, Inbuilt } from "./types/internal";
import { PUBLIC_API_BASE } from "$env/static/public";

export const contactEmail = "contact@osinter.dk";

export const config: {
  images: {
    fullLogo: string;
  };
} = {
  images: {
    fullLogo: "https://osinter.dk/fullLogo.png",
  },
};

export const ListRenderModes: { name: string; value: ArticleListRender }[] = [
  { name: "Large", value: "large" },
  { name: "Title-view", value: "title" },
];

const daySeconds = 24 * 60 * 60 * 1000;
type Intervals = "day" | "week" | "month";

const timeAgo: { [interval in Intervals]: Date } = {
  day: new Date(new Date().getTime() - daySeconds),
  week: new Date(new Date().getTime() - daySeconds * 7),
  month: new Date(new Date().getTime() - daySeconds * 30),
};

const timeUrl = (interval: Intervals) => {
  const params = new URLSearchParams({
    limit: "0",
    sort_by: "publish_date",
    sort_order: "desc",
    complete: "false",
    first_date: timeAgo[interval].toISOString(),
  });

  return new URL(`${PUBLIC_API_BASE}/articles/search?${params.toString()}`);
};

export const inbuiltFeeds: { [key: string]: Inbuilt } = {
  day: {
    id: "day",
    title: "Todays news",
    desc: "All the news available from the last 24 hours",
    url: timeUrl("day"),
  },
  week: {
    id: "week",
    title: "Last 7 days",
    desc: "All the news available from the last 7 days",
    url: timeUrl("week"),
  },
  month: {
    id: "month",
    title: "Last 30 days",
    desc: "All the news available from the last 30 days",
    url: timeUrl("month"),
  },
};

export const getStandardSearch = (): SearchQuery => ({
  limit: 200,

  sort_by: "publish_date",
  sort_order: "desc",

  search_term: "",
  semantic_search: "",
  highlight: true,

  first_date: "",
  last_date: "",

  sources: [],
});
