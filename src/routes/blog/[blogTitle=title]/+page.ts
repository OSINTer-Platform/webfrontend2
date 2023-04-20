import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ parent, params }) => {
    const { posts } = await parent();
    const currentPost = posts[params.blogTitle];

    if (!currentPost) {
        throw error(404, 'Post not found');
    }
    return { currentPost: currentPost };
}) satisfies PageLoad;
