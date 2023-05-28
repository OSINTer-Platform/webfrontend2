import type { PageLoad } from './$types';

import { inbuiltFeeds } from '$shared/config';
import type { ArticleBase } from '$shared/types/api';
import { error } from '@sveltejs/kit';

export const load = (({ params, fetch }) => {
    const fetchArticles = async (): Promise<ArticleBase[]> => {
        const r = await fetch(inbuiltFeeds[params.feed_name].url.toString());
        if (r.ok) {
            return await r.json();
        } else {
            throw error(
                r.status,
                'Error when fetching articles from builtin feed. Please contact system administrator'
            );
        }
    };

    return {
        articles: fetchArticles(),
    };
}) satisfies PageLoad;
