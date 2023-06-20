import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type ArticleListRender = "large" | "title";

export interface Inbuilt {
  id: string;
  title: string;
  desc: string;
  url: URL;
}

export interface HeaderModOptions {
  title: string;
  icon: IconDefinition;
  action?: Function;
  route?: string;
}

export type NavItem = {
  title: string;
  description?: string;
  route: string;
  icon: IconDefinition;
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

export interface UserItemSidebarOption extends SidebarOption {
  id: "inbuilts" | "feeds" | "collections" | "clusters";
}
