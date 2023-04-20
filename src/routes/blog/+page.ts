import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
    const { posts } = await parent();
    const postList = Object.values(posts).sort((a, b) => {
        return b.data.date.valueOf() - a.data.date.valueOf();
    });

    return { postList };
}) satisfies PageLoad;
