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

export type CVESortBy =
  | "document_count"
  | "cve"
  | "publish_date"
  | "modified_date";
export type CVEDateField = "publish_date" | "modified_date";

export interface CVESEarchQuery {
  limit: number;

  sort_by?: CVESortBy;
  sort_order?: SortOrder;

  search_term?: string;
  cves?: string[];
  ids?: string[];

  first_date?: string;
  last_date?: string;
  date_field?: CVEDateField;

  highlight?: boolean;
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

export type CVEReference = {
  url: string;
  source: string;
  tags: string[];
};

export type CVSS3Data = {
  version: "3.0" | "3.1";
  vector_string: string;
  attack_vector: "NETWORK" | "ADJACENT_NETWORK" | "LOCAL" | "PHYSICAL";
  attack_complexity: "LOW" | "HIGH";
  privileges_required: "NONE" | "LOW" | "HIGH";
  user_interaction: "NONE" | "REQUIRED";
  scope: "UNCHANGED" | "CHANGED";
  confidentiality_impact: "NONE" | "LOW" | "HIGH";
  integrity_impact: "NONE" | "LOW" | "HIGH";
  availability_impact: "NONE" | "LOW" | "HIGH";
  base_score: number;
  base_severity: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export type CVSS3 = {
  source: string;
  exploitability_score: number;
  impact_score: number;
  cvss_data: CVSS3Data;
};

export type CVSS2Data = {
  version: "2.0";
  vector_string: string;
  access_vector: "NETWORK" | "ADJACENT_NETWORK" | "LOCAL";
  access_complexity: "LOW" | "MEDIUM" | "HIGH";
  authentication: "MULTIPLE" | "SINGLE" | "NONE";
  confidentiality_impact: "NONE" | "PARTIAL" | "COMPLETE";
  integrity_impact: "NONE" | "PARTIAL" | "COMPLETE";
  availability_impact: "NONE" | "PARTIAL" | "COMPLETE";
  base_score: number;
};

export type CVSS2 = {
  source: string;
  base_severity: "LOW" | "MEDIUM" | "HIGH";
  exploitability_score: number;
  impact_score: number;
  ac_insuf_info: boolean;
  obtain_all_privilege: boolean;
  obtain_user_privilege: boolean;
  obtain_other_privilege: boolean;
  user_interaction_required?: boolean;
  cvss_data: CVSS2Data;
};

export interface CVEBase {
  cve: string;
  document_count: number;

  title: string;
  description: string;
  keywords: string[];

  highlights?: {
    title?: string[];
    description?: string[];
    summary?: string[];
  };

  publish_date: string;
  modified_date: string;

  weaknesses: string[];

  status:
    | "Awaiting Analysis"
    | "Received"
    | "Analyzed"
    | "Rejected"
    | "Modified"
    | "Undergoing Analysis";

  cvss3?: CVSS3;
  cvss2?: CVSS2;

  references: CVEReference[];
}

export interface FullCVE extends CVEBase {
  documents: string[];
  dating: string[];
}
