import type { PageLoad } from './$types';

import type { ArticleBase } from '$shared/types/api';
import { handleResponse } from '$lib/common/query';
import { PUBLIC_API_BASE } from '$env/static/public';

export const load = (({ params, fetch }) => {
    const fetchArticles = async (): Promise<ArticleBase[]> => {
        const r = await fetch(
            `${PUBLIC_API_BASE}/user-items/${params.item_id}/articles`
        );
        return await handleResponse(r);
    };

    return {
        articles: fetchArticles(),
    };
}) satisfies PageLoad;
