import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { ArticleSearchQuery } from "./api";

export type ArticleListRender = "large" | "title";

export interface InbuiltFeed {
  id: string;
  title: string;
  desc: string;
  query: ArticleSearchQuery;
  type: "timecontrol" | "other";
}

export interface HeaderModOptions {
  title: string;
  icon: IconDefinition;
  action?: Function;
  route?: string;
  options?: { [key: string]: string };
}

export type NavItem = {
  title: string;
  description?: string;
  route: string;
  icon: IconDefinition;
  options?: { [key: string]: string };
};

export type SidebarOption = {
  id: string;
  title?: string;
  list: Array<{
    href: string;
    label: string;
    badge?: string;
  }>;
};

export type SearchRestrictFields = {
  [key in keyof ArticleSearchQuery]?: { disabled: boolean; text: string };
};
