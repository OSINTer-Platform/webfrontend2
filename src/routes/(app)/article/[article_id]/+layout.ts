import type { LayoutLoad } from './$types';

import type { Article } from '$shared/types/api';

import { get } from 'svelte/store';
import { fullArticles } from '$state/storedArticles';
import { PUBLIC_API_BASE } from '$env/static/public';

export const load = (({ params, fetch }) => {
    const fullArticleList = get(fullArticles);

    const fetchContent = async (): Promise<Article> => {
        if (params.article_id in fullArticleList) {
            return fullArticleList[params.article_id];
        }

        const r = await fetch(
            `${PUBLIC_API_BASE}/articles/${params.article_id}/content`
        );
        const article = await r.json();

        fullArticles.update((list) => {
            list[params.article_id] = article;
            return list;
        });

        return article;
    };

    return {
        article: fetchContent(),
    };
}) satisfies LayoutLoad;
