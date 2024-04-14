export interface ArticleML {
  cluster: string;
  coordinates: [number, number];
}

export interface ArticleTags {
  automatic: string[];
  interesting: { name: string; values: string[] }[];
}

export interface Article {
  id: string;
  highlights?: {
    title?: string[];
    description?: string[];
    content?: string[];
  };
}

export interface ArticleBase extends Article {
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

  similar?: string[];
  summary?: string;

  ml?: ArticleML;

  tags: ArticleTags;
}

export interface FullArticle extends ArticleBase {
  formatted_content: string;
  content: string;
}

export interface MLArticle extends Article {
  title: string;
  description: string;
  url: string;
  source: string;
  profile: string;
  publish_date: string;
  ml: ArticleML;
}

export interface ClusterBase {
  id: string;
  nr: number;
  document_count: number;

  title: string;
  description: string;
  summary: string;

  keywords: string[];
  highlights?: {
    title?: string[];
    description?: string[];
    summary?: string[];
  };
}

export interface Cluster extends ClusterBase {
  representative_documents: string[];
  documents: string[];
  dating: string[];
}

export interface ArticleCategories {
  [key: string]: {
    name: string;
    image: string;
    url: string;
  };
}

export type ArticleSortBy =
  | ""
  | "publish_date"
  | "read_times"
  | "source"
  | "author"
  | "inserted_at";
export type SortOrder = "desc" | "asc";

export interface ArticleSearchQuery {
  limit: number;

  sort_by?: ArticleSortBy | undefined;
  sort_order?: SortOrder | undefined;

  search_term?: string | undefined;
  semantic_search?: string | undefined;
  highlight?: boolean | undefined;

  first_date?: string | undefined;
  last_date?: string | undefined;

  sources?: string[];
  ids?: string[];
  cluster_id?: string;
}

export interface AccessTokenWithDetails {
  token: string;
  max_age: number;
  secure: boolean;
}

export interface OpenAIChat {
  role: "user" | "assistant" | "system";
  content: string;
  visible: boolean;
  id: string;
}

export interface MLAssistantChat {
  chats: OpenAIChat[];
  article_base: ArticleBase[];
  reached_max: boolean;
}

export interface MLAvailability {
  cluster: boolean;
  map: boolean;
  elser: boolean;
  assistant: boolean;
}

export interface Survey {
  contents: {
    title: string;
    rating: number;
    feedback: string;
  }[];
  version: number;
}

export type AuthArea =
  | "assistant"
  | "cluster"
  | "dashboard"
  | "map"
  | "similar"
  | "summary";
