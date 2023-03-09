import type { PageLoad } from './$types';

import { handleResponse } from '$lib/common';
import { config } from '$shared/config';
import type { ArticleCategories } from '$shared/types/api';

export const load = (async ({ fetch }) => {
    const fetchCategories = async (): Promise<ArticleCategories> => {
        const r = await fetch(`${config.apiRoot}/articles/categories`);
        return await handleResponse(r);
    };

    return {
        sourceCategories: fetchCategories(),
    };
}) satisfies PageLoad;
