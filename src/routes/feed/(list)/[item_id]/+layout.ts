import { handleResponse } from '$lib/common';
import { config } from '$shared/config';
import type { ArticleCategories } from '$shared/types/api';
import type { ItemBase } from '$shared/types/userItems';
import type { LayoutLoad } from './$types';

export const load = (async ({ params, fetch }) => {

    const fetchItem = async (): Promise<ItemBase> => {
        const r = await fetch(`${config.apiRoot}/user-items/${params.item_id}/content`);
        return handleResponse(r);
    };

    const fetchCategories = async (): Promise<ArticleCategories> => {
        const r = await fetch(`${config.apiRoot}/articles/categories`);
        return handleResponse(r);
    };


	return {
		currentItem : fetchItem(),
        sourceCategories: fetchCategories(),
	}

}) satisfies LayoutLoad;
