import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type {
  ArticleBase,
  FullArticle,
  ArticleCategories,
  ArticleSearchQuery,
} from "./api";

export type ArticleListRender = "large" | "title";

export interface InbuiltFeed {
  id: string;
  title: string;
  desc: string;
  url: URL;
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
  blank?: boolean;
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

export type Modal = (
  | {
      modalType: "search";
      modalContent: {
        query?: ArticleSearchQuery;
        searchAction?: (q: ArticleSearchQuery) => void;
        searchText?: string;
      };
    }
  | {
      modalType: "article";
      modalContent: {
        article: FullArticle;
        articleList: Array<{ id: string }>;
        categories: ArticleCategories;
      };
    }
  | {
      modalType: "add-collection";
      modalContent: {
        article: ArticleBase;
      };
    }
  | {
      modalType: "article-list";
      modalContent: {
        articles: ArticleBase[] | Promise<ArticleBase[]>;
      };
    }
  | {
      modalType: "user-settings";
      modalContent: null;
    }
  | {
      modalType: "info";
      modalContent: {
        title: string;
        description: string | string[];
      };
    }
  | {
      modalType: "options";
      modalContent: {
        type: "info" | "success" | "warning" | "error";
        title: string;
        description: string | string[];
        options:
          | {
              text: string;
              type: "primary" | "secondary" | "yes" | "no" | "cancel";
              action: () => boolean | void | Promise<boolean> | Promise<void>;
            }[]
          | (() => boolean | void | Promise<boolean> | Promise<void>);
      };
    }
  | {
      modalType: "survey";
      modalContent: {
        version: number;
      };
    }
  | {
      modalType: "collect-payment";
      modalContent: {
        title?: string;
        clientSecret?: string;
      };
    }
  | {
      modalType: "processing";
      modalContent: {
        process: Promise<any>;
        text?: string;
      };
    }
) & { id: string };
