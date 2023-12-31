import type { LayoutLoad } from "./$types";
import type { Collection, Feed } from "$shared/types/userItems";
import type { ArticleCategories } from "$shared/types/api";

import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load = (async ({ parent, fetch }) => {
  const fetchCategories = async (): Promise<ArticleCategories> => {
    const r = await fetch(`${PUBLIC_API_BASE}/articles/categories`);

    if (r.ok) {
      return await r.json();
    } else {
      throw error(r.status, "Error when fetching categories for articles.");
    }
  };

  const getStandardFeeds = async (): Promise<{ [key: string]: Feed }> => {
    const r = await fetch(`${PUBLIC_API_BASE}/user-items/standard/feeds`);

    if (r.ok) {
      return await r.json();
    } else {
      throw error(r.status, "Error when fetching the standard feeds.");
    }
  };

  const getProtectedData = async (url: string, type: "feed" | "collection") => {
    const r = await fetch(`${PUBLIC_API_BASE}/${url}`);

    if (r.ok) {
      return await r.json();
    } else if (r.status === 401) {
      throw error(
        401,
        `Authentication error when fetching ${type}s. Try refreshing the page, and contact system administrator if error persist`
      );
    } else {
      throw (r.status, `Error when fetching ${type}s.`);
    }
  };

  const categories = fetchCategories();

  const parentData = await parent();
  const user = parentData.user;

  if (user) {
    const data: {
      customSidebar: boolean;
      feeds: Promise<{ [key: string]: Feed }>;
      collections: Promise<{ [key: string]: Collection }>;
      sourceCategories: Promise<ArticleCategories>;
    } = {
      customSidebar: true,
      feeds: getProtectedData("my/feeds/list", "feed"),
      collections: getProtectedData("my/collections/list", "collection"),
      sourceCategories: categories,
    };

    return data;
  } else {
    return {
      customSidebar: true,
      feeds: getStandardFeeds(),
      sourceCategories: categories,
    };
  }
}) satisfies LayoutLoad;
