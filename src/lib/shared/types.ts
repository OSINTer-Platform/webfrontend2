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

export interface Article extends ArticleBase {
    author: string;
    formatted_content: string;
    content: string;
    summary: string;

    ml: {
        similar: Array<string>;
        cluster: number;
    };
}

export interface ItemBase {
    _id: string;
    name: string;
    type: string;
    owner?: string;
}

export interface Collection extends ItemBase {
    ids: string[];
}

enum SortBy {
    publish_date,
    read_times,
    source,
    author,
    inserted_at,
}

enum SortOrder {
    desc,
    asc,
}

export interface Feed extends ItemBase {
    limit: number;

    sort_by: SortBy | null;
    sort_order: SortOrder | null;

    search_term: string | null;
    highlight: boolean;

    first_date: string;
    last_date: string;

    source_category: string[];
}

export interface UserItems {
    feeds?: ItemBase;
    collections?: ItemBase;
    clusters?: ItemBase;
}
