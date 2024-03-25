import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

import { PUBLIC_API_BASE } from "$env/static/public";
import type { AccessTokenWithDetails } from "$shared/types/api";

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const data = await request.formData();

    const username = data.get("username")?.toString() ?? "";
    const password = data.get("password")?.toString() ?? "";

    let remember = false;

    try {
      remember = JSON.parse(data.get("remember")?.toString() as string);
    } catch (SyntaxError) { }

    if (!username) {
      return fail(422, {
        username,
        remember,
        success: false,
        detail: "Please provide a username",
      });
    } else if (!password) {
      return fail(422, {
        username,
        remember,
        success: false,
        detail: "Please provide a password",
      });
    }

    const r = await fetch(
      `${PUBLIC_API_BASE}/auth/get-token?remember_me=${encodeURIComponent(
        remember
      )}`,
      {
        method: "POST",
        credentials: "include",
        headers: new Headers({
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        body: new URLSearchParams({ username, password }).toString(),
      }
    );

    if (r.ok) {
      const token: AccessTokenWithDetails = await r.json();
      cookies.set("access_token", `Bearer ${token.token}`, {
        httpOnly: true,
        secure: token.secure,
        maxAge: remember ? token.max_age : undefined,

        priority: "high",
        path: "/",
      });

      throw redirect(303, "/feed");
    } else {
      return fail(r.status, {
        username,
        remember,
        success: false,
        detail: (await r.json())["detail"],
      });
    }
  },
} satisfies Actions;
