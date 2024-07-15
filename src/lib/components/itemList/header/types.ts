export interface HeaderListItem {
  highlights?: { [key: string]: string[] };
  summary?: string;
}

export type VisualDetail =
  | string
  | Array<string | { content: string; href: string }>;

export type VisualDetailBatch = {
  title: string;
  content: null | undefined | VisualDetail;
  mono?: boolean;
};
