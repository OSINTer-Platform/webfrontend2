import { modalState } from "$state/state";
import { fullArticles } from "$state/storedArticles";

import { page } from "$app/stores";
import { get } from "svelte/store";

import type { Article, ArticleCategories } from "$shared/types/api";
import { PUBLIC_API_BASE } from "$env/static/public";

export async function spawnArticleModal(id: string) {
  const fetchAndConvert = (url: string) => fetch(url).then((r) => r.json());

  const [article, articleCategories]: [Article, ArticleCategories] =
    await Promise.all([
      fetchAndConvert(`${PUBLIC_API_BASE}/articles/${id}/content`),
      fetchAndConvert(`${PUBLIC_API_BASE}/articles/categories`),
    ]);

  fullArticles.update((list) => {
    list[id] = article;
    return list;
  });

  modalState.set({
    modalType: "article",
    modalContent: { article: article, categories: articleCategories },
  });

  const pageData = get(page).data;

  await Promise.all([
    pageData.userCollections.autoUpdate(),
    pageData.alreadyRead.autoUpdate(),
  ]);
}
