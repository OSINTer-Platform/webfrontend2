import { writable, type Writable } from 'svelte/store';
import type { Article } from './types/api';
import type { ArticleRender } from './types/internal';

export const sideOpen: Writable<{ [key: string]: Boolean }> = writable({});

export const localSearch: Writable<string> = writable('');
export const articleRender: Writable<ArticleRender> = writable('large');

export const fullArticles: Writable<{ [key: string]: Article }> = writable({});
