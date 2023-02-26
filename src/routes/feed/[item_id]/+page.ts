import type { PageLoad } from './$types';

import { config } from '$shared/config';
import type { ArticleBase, ArticleCategories, ItemBase } from '$shared/types';
import { error } from '@sveltejs/kit';

export const load = (({ params, fetch }) => {
    const paramUrl = `${config.apiRoot}/user-items/${params.item_id}`;

    const handleResponse = async (response: Response) => {
        const json = await response.json();
        if (response.ok) {
            return json;
        } else {
            throw error(response.status, json);
        }
    };

    const fetchArticles = async (): Promise<ArticleBase[]> => {
        const r = await fetch(`${paramUrl}/articles`);
        return handleResponse(r);
    };

    const fetchItem = async (): Promise<ItemBase> => {
        const r = await fetch(`${paramUrl}/content`);
        return handleResponse(r);
    };

    const fetchCategories = async (): Promise<ArticleCategories> => {
        const r = await fetch(`${config.apiRoot}/articles/categories`);
        return handleResponse(r);
    };

    return {
        articles: fetchArticles(),
        currentItem: fetchItem(),
        sourceCategories: fetchCategories(),
    };
}) satisfies PageLoad;
