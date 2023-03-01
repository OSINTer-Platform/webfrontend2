import { inbuiltFeeds } from '$shared/config';
import type { Inbuilt } from '$shared/types/internal';

import type { LayoutLoad } from './$types';

export const load = (async ({ params }) => {
    const content: { currentItem: Inbuilt } = {
        currentItem: inbuiltFeeds[params.feed_name],
    };

    return content;
}) satisfies LayoutLoad;
