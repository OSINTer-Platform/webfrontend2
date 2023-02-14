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
}
