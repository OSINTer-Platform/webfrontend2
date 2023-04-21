import { config } from '$shared/config';
import { modalState } from '$state/state';
import { fullArticles } from '$state/storedArticles';

import type { Article, ArticleCategories } from '$shared/types/api';

export async function spawnArticleModal(e: MouseEvent, id: string) {
    const fetchAndConvert = (url: string) => fetch(url).then((r) => r.json());

    const small = window.matchMedia(
        'only screen and (max-width: 60rem)'
    ).matches;
    if (small || e.ctrlKey) {
        return;
    }

    e.preventDefault();

    const [article, articleCategories]: [Article, ArticleCategories] =
        await Promise.all([
            fetchAndConvert(`${config.apiRoot}/articles/${id}/content`),
            fetchAndConvert(`${config.apiRoot}/articles/categories`),
        ]);

    fullArticles.update((list) => {
        list[id] = article;
        return list;
    });

    modalState.set({
        modalType: 'article',
        modalContent: { article: article, categories: articleCategories },
    });
}
