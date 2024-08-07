import type { ArticleSearchQuery } from "./types/api";
import type { ArticleListRender, InbuiltFeed } from "./types/internal";
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

export const firstDate = new Date(
  new Date().setFullYear(new Date().getFullYear() - 3)
);

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

const timeQuery = (interval: Intervals): ArticleSearchQuery => ({
  limit: 10000,
  sort_by: "publish_date",
  sort_order: "desc",
  first_date: timeAgo[interval].toISOString(),
});

export const inbuiltFeeds: InbuiltFeed[] = [
  {
    id: "day",
    title: "Todays news",
    desc: "All the news available from the last 24 hours",
    query: timeQuery("day"),
    type: "timecontrol",
  },
  {
    id: "week",
    title: "Last 7 days",
    desc: "All the news available from the last 7 days",
    query: timeQuery("week"),
    type: "timecontrol",
  },
  {
    id: "month",
    title: "Last 30 days",
    desc: "All the news available from the last 30 days",
    query: timeQuery("month"),
    type: "timecontrol",
  },
];

export const getStandardSearch = (): ArticleSearchQuery => ({
  limit: 200,

  sort_by: "publish_date",
  sort_order: "desc",

  search_term: "",
  highlight: true,

  first_date: "",
  last_date: "",

  sources: [],
});
