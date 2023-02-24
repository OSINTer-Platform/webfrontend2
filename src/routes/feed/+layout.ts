import type { LayoutLoad } from './$types';
import type { Collection, Feed } from '$shared/types';

import { queryProtected } from '$lib/common';
import { config } from '$shared/config';

export const load = (async ({ parent, fetch }) => {
    const parentData = await parent();
    const user = parentData.user;

    const getProtectedData = async (url: string) => {
        const r = await queryProtected(url);

        if (r.ok) {
            return r.content;
        }

        return {};
    };

    if (user) {
        const data: {
            feeds: Promise<{ [key: string]: Feed }>;
            collections: Promise<{ [key: string]: Collection }>;
        } = {
            feeds: getProtectedData('/my/feeds/list'),
            collections: getProtectedData('/my/collections/list'),
        };

        return data;
    } else {
        const r = await fetch(`${config.apiRoot}/user-items/standard/feeds`);

        if (r.ok) {
            const content: {
                feeds: { [key: string]: Feed };
            } = { feeds: await r.json() };

            return content;
        }
    }
}) satisfies LayoutLoad;
