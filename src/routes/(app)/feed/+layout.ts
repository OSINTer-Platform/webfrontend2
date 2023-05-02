import type { LayoutLoad } from './$types';
import type { Collection, Feed } from '$shared/types/userItems';

import { handleResponse, queryProtected } from '$lib/common/query';
import type { ArticleCategories } from '$shared/types/api';
import { PUBLIC_API_BASE } from '$env/static/public';

export const load = (async ({ parent, fetch }) => {
    const fetchCategories = async (): Promise<ArticleCategories> => {
        const r = await fetch(`${PUBLIC_API_BASE}/articles/categories`);
        return await handleResponse(r);
    };

    const getStandardFeeds = async (): Promise<{ [key: string]: Feed }> => {
        const r = await fetch(`${PUBLIC_API_BASE}/user-items/standard/feeds`);
        return await handleResponse(r);
    };

    const getProtectedData = async (url: string) => {
        const r = await queryProtected(url);

        if (r.ok) {
            return r.content;
        }

        return {};
    };

    const categories = fetchCategories();

    const parentData = await parent();
    const user = parentData.user;

    if (user) {
        const data: {
            feeds: Promise<{ [key: string]: Feed }>;
            collections: Promise<{ [key: string]: Collection }>;
            sourceCategories: Promise<ArticleCategories>;
        } = {
            feeds: getProtectedData('/my/feeds/list'),
            collections: getProtectedData('/my/collections/list'),
            sourceCategories: categories,
        };

        return data;
    } else {
        return {
            feeds: getStandardFeeds(),
            sourceCategories: categories,
        };
    }
}) satisfies LayoutLoad;
