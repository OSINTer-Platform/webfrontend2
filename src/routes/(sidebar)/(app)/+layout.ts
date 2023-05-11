import { PUBLIC_API_BASE } from '$env/static/public';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
    const getUserObject = async () => {
        const r = await fetch(`${PUBLIC_API_BASE}/auth/status`);
        return r.ok ? r.json() : null;
    };

    return {
        user: getUserObject(),
    };
}) satisfies LayoutLoad;
