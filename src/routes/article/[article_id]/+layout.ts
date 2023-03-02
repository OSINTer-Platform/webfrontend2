import type { LayoutLoad } from './$types';

import { config } from '$shared/config';
import type { Article } from '$shared/types/api';

import { get } from 'svelte/store';
import { fullArticles } from '$shared/state';

export const load = (({ params, fetch }) => {
    const fullArticleList = get(fullArticles);

    const fetchContent = async (): Promise<Article> => {
        if (params.article_id in fullArticleList) {
            return fullArticleList[params.article_id];
        }

        const r = await fetch(
            `${config.apiRoot}/articles/${params.article_id}/content`
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
