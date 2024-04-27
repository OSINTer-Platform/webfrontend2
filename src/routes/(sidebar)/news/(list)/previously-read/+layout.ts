import { derived } from "svelte/store";
import type { LayoutLoad } from "./$types";
import { PUBLIC_API_BASE } from "$env/static/public";
import { toUrl } from "$lib/common/searchQuery";
import type { ArticleBase } from "$shared/types/api";

export const load: LayoutLoad = async ({ parent, fetch }) => {
  const { readArticles } = await parent();
  const loadingArticles = derived(
    readArticles,
    async ($readArticles): Promise<ArticleBase[]> => {
      const r = await fetch(
        `${PUBLIC_API_BASE}/articles/search?${toUrl({
          limit: 50,
          ids: $readArticles,
        })}`
      );
      return r.ok ? await r.json() : [];
    }
  );
  return {
    loadingArticles,
    customSidebar: true,
    meta: {
      title: "Previously read | OSINTer",
      description: "List of the articles you have recently viewed in OSINTer",
    },
  };
};
