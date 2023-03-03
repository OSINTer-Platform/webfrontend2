import { persisted } from 'svelte-local-storage-store';
import type { Writable } from 'svelte/store';

import type { Article } from './types/api';
import type { ArticleListRender } from './types/internal';

export const sideOpen: Writable<{ [key: string]: Boolean }> = persisted(
    'sidebar-open',
    {}
);

export const localSearch: Writable<string> = persisted('localSearch', '');
export const articleListRender: Writable<ArticleListRender> = persisted(
    'articleListRender',
    'large'
);

export const fullArticles: Writable<{ [key: string]: Article }> = persisted(
    'fullArticleList',
    {}
);
