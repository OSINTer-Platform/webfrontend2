import type { PageLoad } from './$types';

export const load = (({ url }) => {
    return { msg: url.searchParams.get('msg') };
}) satisfies PageLoad;
