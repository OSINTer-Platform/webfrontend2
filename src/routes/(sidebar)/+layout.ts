import { PUBLIC_API_BASE } from '$env/static/public';
import type { User } from '$shared/types/userItems';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
    const getUserObject = async (): Promise<User | null> => {
        const r = await fetch(`${PUBLIC_API_BASE}/auth/status`);
        return r.ok ? r.json() : null;
    };

    return {
        user: getUserObject(),
    };
}) satisfies LayoutLoad;
