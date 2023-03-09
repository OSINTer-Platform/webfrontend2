import { persisted } from 'svelte-local-storage-store';
import { writable, type Writable } from 'svelte/store';

import type { Article } from './types/api';
import type { ArticleListRender } from './types/internal';

export const modalState: Writable<{
    modalType: string | null;
    modalContent: { [key: string]: any } | null;
}> = persisted('modalState', {
    modalType: null,
    modalContent: null,
});

export const sideOpen: Writable<{ [key: string]: Boolean }> = persisted(
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
