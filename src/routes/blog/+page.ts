import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
    const { posts } = await parent();
    const postList = Object.values(posts).sort((a, b) => {
        const aDate = new Date(a.data.date);
        const bDate = new Date(b.data.date);

        return aDate.valueOf() - bDate.valueOf();
    });

    return { postList };
}) satisfies PageLoad;
