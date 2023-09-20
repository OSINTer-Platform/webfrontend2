export interface ArticleTags {
  automatic: string[];
  interresting: { [key: string]: string[] };
}

export interface ArticleBase {
  id: string;

  title: string;
  description: string;

  url: string;
  image_url: string;

  profile: string;
  source: string;

  author: string | null;

  publish_date: string;
  inserted_at: string;

  read_times: number;

  similar: string[];

  ml: {
    cluster: number;
    coordinates: [number, number];
  };

  tags: ArticleTags;
}

export interface Article extends ArticleBase {
  formatted_content: string;
  content: string;

  summary: string;
}

export interface MLArticle {
  id: string;

  title: string;
  description: string;
  source: string;
  profile: string;
  publish_date: string;
  ml: {
    cluster: number;
    coordinates: [number, number];
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
  | ""
  | "publish_date"
  | "read_times"
  | "source"
  | "author"
  | "inserted_at";
export type SortOrder = "desc" | "asc";

export interface SearchQuery {
  limit: number;

  sort_by: SortBy | undefined;
  sort_order: SortOrder | undefined;

  search_term: string | undefined;
  semantic_search: string | undefined;
  highlight: boolean | undefined;

  first_date: string | undefined;
  last_date: string | undefined;

  sources: string[];
}

export interface AccessTokenWithDetails {
  token: string;
  maxAge: number;
  secure: boolean;
}
