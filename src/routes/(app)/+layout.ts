import type { LayoutLoad } from './$types';
import { config } from '$shared/config';

export const load = (async ({ fetch }) => {
    const getUserObject = async () => {
        const r = await fetch(`${config.apiRoot}/auth/status`);
        return r.ok ? r.json() : null;
    };

    return {
        user: getUserObject(),
    };
}) satisfies LayoutLoad;
