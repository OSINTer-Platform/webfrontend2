import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
    return /^[a-zA-Z0-9-_]{20}$/.test(param);
}) satisfies ParamMatcher;
