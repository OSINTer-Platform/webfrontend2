import { PUBLIC_API_BASE } from '$env/static/public';
import { handleResponse } from '$lib/common/query';
import type { ItemBase } from '$shared/types/userItems';
import type { LayoutLoad } from './$types';

export const load = (async ({ params, fetch }) => {
    const fetchItem = async (): Promise<ItemBase> => {
        const r = await fetch(
            `${PUBLIC_API_BASE}/user-items/${params.item_id}/content`
        );
        return await handleResponse(r);
    };

    return {
        currentItem: fetchItem(),
    };
}) satisfies LayoutLoad;
