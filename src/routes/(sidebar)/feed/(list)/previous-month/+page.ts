import type { ArticleBase } from '$shared/types/api';
import { get, writable, type Writable } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ parent, fetch }) => {
    const parentData = await parent();

    const getArticles = async (url: URL): Promise<ArticleBase[]> => {
        const r = await fetch(url);
        if (r.ok) {
            return await r.json();
        } else {
            console.error(`Error when fetching articles from url "${url}"`);
            return [];
        }
    };

    const month = parentData.monthLookup[get(parentData.currentMonth)];
    const articles: Writable<Promise<ArticleBase[]>> = writable(
        getArticles(month.url)
    );

    return {
        articles: articles,
        fetchArticles: getArticles,
    };
}) satisfies PageLoad;
