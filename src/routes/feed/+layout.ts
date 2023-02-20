import type { LayoutLoad } from './$types';
import type { Collection, Feed } from '$shared/types';

import { queryProtected } from '$lib/common';
import { config } from '$shared/config';

export const load = (async ({ parent }) => {
    const parentData = await parent();
    const user = parentData.user;

    const getFeeds = async (): Promise<{ [key: string]: Feed }> => {
        const r = await queryProtected('/my/feeds/list');
        if (r.ok) {
            return r.content;
        }

        return {};
    };

    const getCollections = async (): Promise<{ [key: string]: Collection }> => {
        const r = await queryProtected('/my/collections/list');
        if (r.ok) {
            return r.content;
        }

        return {};
    };

    if (user) {
        return {
            feeds: getFeeds(),
            collections: getCollections(),
        };
    } else {
        const r = await fetch(`${config.apiRoot}/user-items/standard`);

        if (r.ok) {
            const content: {
                feeds: { [key: string]: Feed };
                collections: { [key: string]: Collection };
            } = await r.json();

            return content;
        }
    }
}) satisfies LayoutLoad;
