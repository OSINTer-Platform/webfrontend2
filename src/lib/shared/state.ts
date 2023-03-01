import { writable, type Writable } from 'svelte/store';
import type { ArticleRender } from './types/internal';

export const localSearch: Writable<string> = writable("");
export const articleRender: Writable<ArticleRender> = writable("large")
