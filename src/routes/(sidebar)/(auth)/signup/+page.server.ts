import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { PUBLIC_API_BASE } from '$env/static/public';

export const actions = {
    default: async ({ request, fetch }) => {
        const data = await request.formData();

        const username = data.get('username')?.toString() ?? '';
        const password = data.get('password')?.toString() ?? '';
        const repeatPassword = data.get('repeat-password')?.toString() ?? '';
        const email = data.get('email')?.toString() ?? '';

        if (!username) {
            return fail(422, {
                username,
                success: false,
                detail: 'Please provide a username',
            });
        } else if (!password) {
            return fail(422, {
                username,
                success: false,
                detail: 'Please provide a password',
            });
        } else if (password != repeatPassword) {
            return fail(422, {
                username,
                success: false,
                detail: 'Passwords does not match',
            });
        }

        const r = await fetch(`${PUBLIC_API_BASE}/auth/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
            }),
            body: new URLSearchParams({ username, password, email }).toString(),
        });

        if (r.ok) {
            throw redirect(
                303,
                `/login?${new URLSearchParams({
                    msg: 'User successfully created, please login down below to enter the wonderful world of CTI',
                }).toString()}`
            );
        } else {
            return fail(r.status, {
                username,
                success: false,
                detail: (await r.json())['detail'],
            });
        }
    },
} satisfies Actions;
