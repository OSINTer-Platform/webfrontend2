import type { LayoutLoad } from './$types';
import { config } from '$shared/config';

export const load = (async ({ fetch, route }) => {
    const getUserObject = async () => {
        const r = await fetch(`${config.apiRoot}/auth/status`);
        return r.ok ? r.json() : null;
    };

    const pagesWithSidebar = /^\/(feed|article).*/;
    return {
        user: getUserObject(),
        customSidebar: route.id ? pagesWithSidebar.test(route.id) : false,
    };
}) satisfies LayoutLoad;
