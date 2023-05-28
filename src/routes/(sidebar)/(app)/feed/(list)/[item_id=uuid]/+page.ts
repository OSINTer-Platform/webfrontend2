import type { PageLoad } from './$types';

import type { ArticleBase } from '$shared/types/api';
import { PUBLIC_API_BASE } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const load = (({ params, fetch }) => {
    const fetchArticles = async (): Promise<ArticleBase[]> => {
        const r = await fetch(
            `${PUBLIC_API_BASE}/user-items/${params.item_id}/articles`
        );

        if (r.ok) {
            return await r.json();
        } else {
            throw error(
                r.status,
                'Error when fetching articles for user-item. Please contact system administrator'
            );
        }
    };

    return {
        articles: fetchArticles(),
    };
}) satisfies PageLoad;
