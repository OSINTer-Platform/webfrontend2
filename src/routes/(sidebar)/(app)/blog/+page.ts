import { sortPosts } from '$lib/common/blog';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
    const { posts } = await parent();

    return { postList: sortPosts(Object.values(posts)) };
}) satisfies PageLoad;
