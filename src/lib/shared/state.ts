import { writable, type Writable } from 'svelte/store';
import type { ArticleRender } from './types/internal';

export const sideOpen: Writable<{ [key: string]: Boolean }> = writable({});

export const localSearch: Writable<string> = writable('');
export const articleRender: Writable<ArticleRender> = writable('large');
