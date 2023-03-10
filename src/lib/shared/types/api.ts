export interface ArticleBase {
    title: string;
    description: string;
    url: string;
    image_url: string;

    profile: string;
    source: string;

    publish_date: string;
    inserted_at: string;

    read_times: number;
    id: string;
}

export interface ArticleTags {
    automatic: string[];
    interresting: {
        [key: string]: {
            results: string[];
            tag: true;
        };
    };
}

export interface Article extends ArticleBase {
    author: string;
    formatted_content: string;
    content: string;

    tags: ArticleTags;

    summary?: string;
    ml?: {
        similar: Array<string>;
        cluster: number;
    };
}

export interface ArticleCategories {
    [key: string]: {
        name: string;
        image: string;
        url: string;
    };
}

export type SortBy =
    | ''
    | 'publish_date'
    | 'read_times'
    | 'source'
    | 'author'
    | 'inserted_at';
export type SortOrder = 'desc' | 'asc';

export interface SearchQuery {
    limit: number;

    sort_by: SortBy | null;
    sort_order: SortOrder | null;

    search_term: string | null;
    highlight: boolean | null;

    first_date: string | null;
    last_date: string | null;

    source_category: string[];
}
