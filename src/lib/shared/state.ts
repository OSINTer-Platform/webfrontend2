import { persisted } from 'svelte-local-storage-store';
import { writable, type Writable } from 'svelte/store';

import type { Article, ArticleCategories } from './types/api';
import type { ArticleListRender } from './types/internal';

export const modalState: Writable<
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

// For controlling the submenus in the sidebar using the ID of the submenu as the key
export const sideMenuOpen: Writable<{ [key: string]: Boolean }> = persisted(
    'sidebar-open',
    {}
);

export const localSearch: Writable<string> = writable('');
export const articleListRender: Writable<ArticleListRender> = persisted(
    'articleListRender',
    'large'
);

export const fullArticles: Writable<{ [key: string]: Article }> = persisted(
    'fullArticleList',
    {}
);
