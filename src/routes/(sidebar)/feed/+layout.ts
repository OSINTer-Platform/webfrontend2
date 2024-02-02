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

  async function getProtectedData(
    url: string,
    type: "feed"
  ): Promise<{ [key: string]: Feed }>;
  async function getProtectedData(
    url: string,
    type: "collection"
  ): Promise<{ [key: string]: Collection }>;
  async function getProtectedData(
    url: string,
    type: "feed" | "collection"
  ): Promise<{ [key: string]: Feed } | { [key: string]: Collection }> {
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
  }

  const categories = fetchCategories();
  const meta = {
    title: "Your Feeds | OSINTer",
    description:
      "Curious on the newest happenings in the cybersecurity sphere? Well, look no further...",
  };

  const parentData = await parent();
  const user = parentData.user;

  if (user) {
    const [feeds, collections, sourceCategories] = await Promise.all([
      getProtectedData("my/feeds/list", "feed"),
      getProtectedData("my/collections/list", "collection"),
      categories,
    ]);

    return {
      meta,
      customSidebar: true,
      feeds,
      collections,
      sourceCategories,
    };
  } else {
    const [feeds, sourceCategories] = await Promise.all([
      getStandardFeeds(),
      categories,
    ]);

    return {
      meta,
      customSidebar: true,
      feeds,
      sourceCategories,
    };
  }
}) satisfies LayoutLoad;
