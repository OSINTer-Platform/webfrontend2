import type { SearchQuery } from "./api";

export interface ItemBase {
  _id: string;
  name: string;
  type: "feed" | "collection";
  owner?: string;
  deleteable: boolean;
}

export interface Collection extends ItemBase {
  type: "collection";
  ids: string[];
}

export interface Feed extends ItemBase, SearchQuery {
  type: "feed";
}

export interface UserItems {
  feeds?: ItemBase;
  collections?: ItemBase;
  clusters?: ItemBase;
}

export interface User {
  _id: string;
  username: string;
  active: boolean;

  already_read: string;

  feed_ids: string[];
  collection_ids: string[];

  feeds: Feed[];
  collections: Collection[];
}
