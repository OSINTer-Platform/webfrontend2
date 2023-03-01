import { handleResponse } from '$lib/common';
import { config } from '$shared/config';
import type { ItemBase } from '$shared/types/userItems';
import type { LayoutLoad } from './$types';

export const load = (async ({ params, fetch }) => {
    const fetchItem = async (): Promise<ItemBase> => {
        const r = await fetch(
            `${config.apiRoot}/user-items/${params.item_id}/content`
        );
        return await handleResponse(r);
    };

    return {
        currentItem: fetchItem(),
    };
}) satisfies LayoutLoad;
