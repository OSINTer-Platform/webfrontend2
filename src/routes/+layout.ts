import type { LayoutLoad } from './$types';

export const load = (async ({ route }) => {
    const pagesWithSidebar = /^\/\(sidebar\)\/(\(app\)\/)?(feed|article).*/;
    return {
        customSidebar: route.id ? pagesWithSidebar.test(route.id) : false,
    };
}) satisfies LayoutLoad;
