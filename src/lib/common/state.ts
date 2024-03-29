import { modalState } from "$state/modals";
import { fullArticles } from "$state/storedArticles";

import { page } from "$app/stores";
import { get } from "svelte/store";

import type { FullArticle, ArticleCategories } from "$shared/types/api";
import { PUBLIC_API_BASE } from "$env/static/public";
import { goto } from "$app/navigation";

export async function spawnArticleModal(
  id: string,
  articleList: Array<{ id: string }>
) {
  const fetchAndConvert = (url: string) =>
    fetch(url).then((r) => {
      if (!r.ok) return null;
      return r.json();
    });

  const [article, articleCategories]: [
    FullArticle | null,
    ArticleCategories | null
  ] = await Promise.all([
    fetchAndConvert(`${PUBLIC_API_BASE}/articles/${id}/content`),
    fetchAndConvert(`${PUBLIC_API_BASE}/articles/categories`),
  ]);

  if (!article || !articleCategories) {
    goto(`/article/${id}`);
    return false;
  }

  fullArticles.update((list) => {
    list[id] = article;
    return list;
  });

  modalState.append({
    modalType: "article",
    modalContent: { article, articleList, categories: articleCategories },
  });

  const pageData = get(page).data;

  await Promise.all([
    pageData.userCollections.autoUpdate(),
    pageData.alreadyRead.autoUpdate(),
  ]);

  return true;
}
