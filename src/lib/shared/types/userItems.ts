import type { SearchQuery } from "./api";
import type { ArticleListRender } from "./internal";

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
  premium: number;

  already_read: string;

  feed_ids: string[];
  collection_ids: string[];

  feeds: Feed[];
  collections: Collection[];

  settings: {
    dark_mode: boolean;
    render_external: boolean;
    list_render_mode: ArticleListRender;
  };

  payment: {
    stripe_id: string;
    action: {
      last_updated: number;
      required: boolean;
      payment_intent: string;
      invoice_url: string;
    };
    subscription: {
      last_updated: number;
      level: "" | "pro";
      state: "" | "active" | "past_due" | "closed";
    };
  };
}
