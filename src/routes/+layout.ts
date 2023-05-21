import type { LayoutLoad } from './$types';

export const load = (async ({ route }) => {
    const pagesWithSidebar = /^\/\(sidebar\)\/(\(app\)\/)?(feed|article).*/;
    return {
        burgerMenu: route.id !== '/',
        customSidebar: route.id ? pagesWithSidebar.test(route.id) : false,
    };
}) satisfies LayoutLoad;
