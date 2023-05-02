import { config } from '$shared/config';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import * as set_cookie_parser from 'set-cookie-parser';

export const actions = {
    default: async ({ request, cookies, fetch }) => {
        const data = await request.formData();

        const username = data.get('username')?.toString() ?? '';
        const password = data.get('password')?.toString() ?? '';
        let remember = false;

        try {
            remember = JSON.parse(data.get('remember')?.toString() as string);
        } catch (SyntaxError) {}

        if (!username) {
            return fail(422, {
                username,
                remember,
                success: false,
                detail: 'Please provide a username',
            });
        } else if (!password) {
            return fail(422, {
                username,
                remember,
                success: false,
                detail: 'Please provide a password',
            });
        }

        const r = await fetch(
            `${config.apiRoot}/auth/login?remember_me=${encodeURIComponent(
                remember
            )}`,
            {
                method: 'POST',
                credentials: 'include',
                headers: new Headers({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
                body: new URLSearchParams({ username, password }),
            }
        );

        if (r.ok) {
            const cookie = set_cookie_parser.parseString(
                r.headers.get('set-cookie') ?? '',
                { decodeValues: false }
            );

            if (!cookie) {
                return fail(500, {
                    detail: 'Communication with authentication backend failed',
                });
            }

            cookies.set(cookie.name, cookie.value, {
                path: cookie.path,
                maxAge: cookie.maxAge,
                secure: cookie.secure,
                httpOnly: cookie.httpOnly,
                sameSite: 'strict',
                encode: (s: string) => s,
            });

            throw redirect(303, '/');
        } else {
            return fail(r.status, {
                username,
                remember,
                success: false,
                detail: (await r.json())['detail'],
            });
        }
    },
} satisfies Actions;
