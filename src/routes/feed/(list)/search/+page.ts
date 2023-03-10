import type { PageLoad } from './$types';

import { handleResponse } from '$lib/common/query';
import type { ArticleBase } from '$shared/types/api';
import { config } from '$shared/config';

export const load = (async ({ fetch, parent }) => {
    const { searchUrl } = await parent();

    const fetchArticles = async (): Promise<ArticleBase[]> => {
        const r = await fetch(`${config.apiRoot}/articles/search?${searchUrl}`);
        return await handleResponse(r);
    };

    return {
        articles: fetchArticles(),
    };
}) satisfies PageLoad;
