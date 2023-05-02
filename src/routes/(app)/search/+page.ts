import type { PageLoad } from './$types';

import { handleResponse } from '$lib/common/query';
import type { ArticleCategories } from '$shared/types/api';
import { PUBLIC_API_BASE } from '$env/static/public';

export const load = (async ({ fetch }) => {
    const fetchCategories = async (): Promise<ArticleCategories> => {
        const r = await fetch(`${PUBLIC_API_BASE}/articles/categories`);
        return await handleResponse(r);
    };

    return {
        sourceCategories: fetchCategories(),
    };
}) satisfies PageLoad;
