import type { ParamMatcher } from '@sveltejs/kit';
import { inbuiltFeeds } from '$shared/config';

export const match = ((param) => {
    return Object.keys(inbuiltFeeds).includes(param);
}) satisfies ParamMatcher;
