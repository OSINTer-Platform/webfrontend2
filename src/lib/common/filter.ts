import type { ArticleBase } from '$shared/types/api';

export function filterArticles(articles: ArticleBase[], search: string) {
    search = search.toLowerCase();

    if (search.length > 0) {
        articles = articles.filter((article) =>
            Object.values(article).some((field) =>
                field?.toLowerCase?.().includes?.(search)
            )
        );
    }

    return articles;
}
