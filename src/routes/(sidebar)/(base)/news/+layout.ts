import type { LayoutLoad } from "./$types";
import type { ArticleCategories } from "$shared/types/api";

import { PUBLIC_API_BASE } from "$env/static/public";
import { error } from "@sveltejs/kit";

export const load = (async ({ fetch }) => {
  const fetchCategories = async (): Promise<ArticleCategories> => {
    const r = await fetch(`${PUBLIC_API_BASE}/articles/categories`);

    if (r.ok) {
      return await r.json();
    } else {
      error(r.status, "Error when fetching categories for articles.");
    }
  };

  const meta = {
    title: "Your Feeds | OSINTer",
    description:
      "Curious on the newest happenings in the cybersecurity sphere? Well, look no further...",
  };

  const sourceCategories = await fetchCategories();

  return {
    meta,
    customSidebar: true,
    sourceCategories,
  };
}) satisfies LayoutLoad;
