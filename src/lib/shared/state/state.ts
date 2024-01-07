import { persisted } from "svelte-persisted-store";
import { writable, type Writable } from "svelte/store";

import type {
  FullArticle,
  ArticleBase,
  ArticleCategories,
  SearchQuery,
} from "../types/api";
import type { ArticleListRender } from "../types/internal";

export const modalState: Writable<
  | {
      modalType: "search";
      modalContent: {
        query?: SearchQuery;
        searchAction?: (q: SearchQuery) => void;
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
      modalType: null;
      modalContent: null;
    }
> = persisted("modalState", {
  modalType: null,
  modalContent: null,
});

// For controlling if the sidebar is open on small screens
export const sideOpen: Writable<Boolean> = writable(false);
// For controlling the submenus in the sidebar using the ID of the submenu as the key
export const sideMenuOpen: Writable<{ [key: string]: Boolean }> = persisted(
  "sidebar-open",
  {}
);

export const articleListRender: Writable<ArticleListRender> = persisted(
  "articleListRender",
  "large"
);

export const feedLocalSearch = writable("");
export const showRead = writable(true);

export const darkMode = writable(true);
