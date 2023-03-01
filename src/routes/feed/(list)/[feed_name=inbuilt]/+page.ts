import type { PageLoad } from './$types';

import { inbuiltFeeds } from '$shared/config';
import { handleResponse } from '$lib/common';
import type { ArticleBase } from '$shared/types/api';

export const load = (({ params, fetch }) => {
    const fetchArticles = async (): Promise<ArticleBase[]> => {
        const r = await fetch(inbuiltFeeds[params.feed_name].url.toString());
        return await handleResponse(r);
    };

    return {
        articles: fetchArticles(),
    };
}) satisfies PageLoad;
