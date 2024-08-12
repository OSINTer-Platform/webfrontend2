import type { ArticleSearchQuery } from "./api";
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

export interface Feed extends ItemBase, ArticleSearchQuery {
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

  feed_ids: string[];
  collection_ids: string[];
  read_articles: string[];

  premium: {
    status: boolean;
    expire_time: number;
    acknowledged: { [key: string]: string };
  };

  settings: {
    dark_mode: boolean;
    render_external: boolean;
    list_render_mode: ArticleListRender;
  };

  payment: {
    stripe_id: string;
    invoice: {
      last_updated: number;
      action_required: boolean;
      action_type: "" | "authenticate" | "update";
      payment_intent: string;
      invoice_url: string;
    };
    subscription: {
      last_updated: number;
      level: "" | "base" | "pro";
      state: "" | "active" | "past_due" | "closed";
      cancel_at_period_end: boolean;
      current_period_end: number;
    };
  };
}
