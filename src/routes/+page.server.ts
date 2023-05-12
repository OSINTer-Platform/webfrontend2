import { getPosts, sortPosts } from '$lib/common/blog';

import type { PageServerLoad } from './$types';
export const load = (async () => {
    return { posts: sortPosts(Object.values(getPosts())).slice(0, 4) };
}) satisfies PageServerLoad;
