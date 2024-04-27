import type { LayoutLoad } from "./$types";
import { derived } from "svelte/store";
import { queryArticlesById } from "$lib/common/queryArticles";

export const load: LayoutLoad = async ({ parent, fetch }) => {
  const { readArticles } = await parent();
  const loadingArticles = derived(readArticles, ($readArticles) =>
    queryArticlesById($readArticles.slice(0, 1000), true, 10000, fetch)
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
