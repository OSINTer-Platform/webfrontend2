import type { PageLoad } from './$types';

import { config } from '$shared/config';
import type { Article } from '$shared/types/api';

export const load = (({ params, fetch }) => {
    const fetchContent = async (): Promise<Article> => {
        const r = await fetch(
            `${config.apiRoot}/articles/${params.article_id}/content`
        );
        const article = await r.json();
        return article;
    };

    return {
        article: fetchContent(),
    };
}) satisfies PageLoad;
