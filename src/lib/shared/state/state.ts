import { persisted } from 'svelte-local-storage-store';
import { writable, type Writable } from 'svelte/store';

import type { Article, ArticleCategories, SearchQuery } from '../types/api';
import type { ArticleListRender } from '../types/internal';

export const modalState: Writable<
    | {
          modalType: 'search';
          modalContent: {
              query: SearchQuery | undefined;
              searchAction: (q: SearchQuery) => void;
              searchText: string;
          };
      }
    | {
          modalType: 'article';
          modalContent: { article: Article; categories: ArticleCategories };
      }
    | {
          modalType: null;
          modalContent: null;
      }
> = persisted('modalState', {
    modalType: null,
    modalContent: null,
});

// For controlling if the sidebar is open on small screens
export const sideOpen: Writable<Boolean> = writable(false);
// For controlling the submenus in the sidebar using the ID of the submenu as the key
export const sideMenuOpen: Writable<{ [key: string]: Boolean }> = persisted(
    'sidebar-open',
    {}
);

export const articleListRender: Writable<ArticleListRender> = persisted(
    'articleListRender',
    'large'
);

export const feedLocalSearch = writable('');
