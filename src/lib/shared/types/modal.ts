import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type {
  ArticleBase,
  FullArticle,
  ArticleCategories,
  ArticleSearchQuery,
} from "./api";
import type { ComponentType, SvelteComponent } from "svelte";
import type { Feed, Webhook, WebhookTarget } from "./userItems";

type ModalBase = {
  id: string;
};

export type ActionsModal = {
  modalType: "actions";
  modalContent: {
    options: {
      action: () => boolean | void | Promise<boolean> | Promise<void>;
      text: string;
      icon?: IconDefinition;
    }[];
  };
} & ModalBase;

export type AddCollectionModal = {
  modalType: "add-collection";
  modalContent: {
    article: ArticleBase;
  };
} & ModalBase;

export type ArticleListModal = {
  modalType: "article-list";
  modalContent: {
    articles: ArticleBase[] | Promise<ArticleBase[]>;
  };
} & ModalBase;

export type ArticleModal = {
  modalType: "article";
  modalContent: {
    article: FullArticle;
    articleList: Array<{ id: string }>;
    categories: ArticleCategories;
  };
} & ModalBase;

export type AttachWebhooks = {
  modalType: "attach-webhooks";
  modalContent: {
    feed: Feed;
  };
} & ModalBase;

export type CollectPaymentModal = {
  modalType: "collect-payment";
  modalContent: {
    title?: string;
    clientSecret?: string;
  };
} & ModalBase;

export type CustomModal = {
  modalType: "custom";
  modalContent: {
    data: any;
    class?: string;
    component: ComponentType<SvelteComponent<{ modalId: string; data: any }>>;
  };
} & ModalBase;

export type InfoModal = {
  modalType: "info";
  modalContent: {
    title: string;
    description: string | string[];
  };
} & ModalBase;

export type OptionsModal = {
  modalType: "options";
  modalContent: {
    type: "info" | "success" | "warning" | "error";
    title: string;
    description: string | string[];
    options:
      | {
          text: string;
          type: "primary" | "secondary" | "yes" | "no" | "cancel";
          action: () => boolean | void | Promise<boolean> | Promise<void>;
        }[]
      | (() => boolean | void | Promise<boolean> | Promise<void>);
  };
} & ModalBase;

export type ProcessingModal = {
  modalType: "processing";
  modalContent: {
    process: Promise<any>;
    text?: string;
  };
} & ModalBase;

export type SearchModal = {
  modalType: "search";
  modalContent: {
    query?: ArticleSearchQuery;
    searchAction?: (q: ArticleSearchQuery) => void;
    searchText?: string;
  };
} & ModalBase;

export type SurveyModal = {
  modalType: "survey";
  modalContent: {
    version: number;
  };
} & ModalBase;

export type WebhookModal = {
  modalType: "webhook";
  modalContent: {
    data?: {
      name?: string;
      target?: WebhookTarget;
      id: string;
    };
    action: "update" | "create";
  };
} & ModalBase;

export type Modal =
  | ActionsModal
  | AddCollectionModal
  | ArticleListModal
  | ArticleModal
  | AttachWebhooks
  | CollectPaymentModal
  | CustomModal
  | InfoModal
  | OptionsModal
  | ProcessingModal
  | SearchModal
  | SurveyModal
  | WebhookModal;
