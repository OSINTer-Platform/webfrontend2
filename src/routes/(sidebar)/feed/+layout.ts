import type { LayoutLoad } from "./$types";
import type { Collection, Feed } from "$shared/types/userItems";

import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";
import { get } from "svelte/store";

export const load = (async ({ parent, fetch, depends }) => {
  depends("page:feedRoot");

  const throwAuthError = () =>
    error(401, {
      message: "",
      title: "You have to be logged in to access your feeds",
      description: [
        "Custom feeds and collections are only available to users who are signed in",
        "Do you want to try it out?",
        "Log in or sign-up below",
      ],
      logo: false,
      actions: [
        { title: "Login", href: "/login" },
        { title: "Sign-up", href: "/signup" },
      ],
    });

  async function fetchUserData<T>(
    url: string,
    type: string
  ): Promise<T | null> {
    const r = await fetch(`${PUBLIC_API_BASE}${url}`);

    if (r.ok) return await r.json();
    else if (r.status === 401 || r.status === 403) return null;
    else error(r.status, `Error when fetching ${type}`);
  }

  const meta = {
    title: "Your Feeds | OSINTer",
    description:
      "Curious on the newest happenings in the cybersecurity sphere? Well, look no further...",
  };

  const [feedsPromise, collectionsPromise] = [
    fetchUserData<{ [key: string]: Feed }>("/my/feeds/list", "your feeds"),
    fetchUserData<{ [key: string]: Collection }>(
      "/my/collections/list",
      "your collections"
    ),
  ];

  const parentData = await parent();
  const user = get(parentData.user);

  if (user) {
    const [feeds, collections] = await Promise.all([
      feedsPromise,
      collectionsPromise,
    ]);

    if (!feeds || !collections) return throwAuthError();

    return {
      meta,
      customSidebar: true,
      feeds,
      collections,
    };
  } else throwAuthError();
}) satisfies LayoutLoad;
