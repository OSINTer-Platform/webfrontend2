// See https://kit.svelte.dev/docs/types#app

import type { User } from "$shared/types/userItems";
import type { BackgroundUpdatable, ListStore } from "$lib/common/customStores";
import type { ArticleBase, MLAvailability } from "$shared/types/api";
import type { Collection } from "$shared/types/userItems";
import type { Writable } from "svelte/store";
import type { ArticleListRender } from "$shared/types/internal";
import type { Readable } from "svelte/motion";

// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      message: string;
      title?: string;
      description?: string | string[];
      logo?: boolean;
      actions?: Array<{
        title: string;
        action?: () => void;
        href?: string;
      }>;
    }
    // interface Locals {}
    interface PageData {
      mlAvailability: MLAvailability;
      user: Writable<User | null>;
      authorizeForArea: Readable<(area: AuthArea) => boolean>;
      customSidebar: boolean;
      readArticles: ListStore<string> | undefined;
      userCollections: BackgroundUpdatable<{ [key: string]: Collection }>;
      meta: {
        title?: string | { visual: string; meta: string };
        description?: string;
        image?: string;
        type?: string;
      };
      remindMe: {
        paymentUpdate: Writable<number>;
      };
      settings: {
        darkMode: Writable<boolean>;
        listRenderMode: Writable<ArticleListRender>;
        renderExternal: Writable<boolean>;
      };
      stripe: {
        paymentIntentClientSecret: string | null;
      };
      articles?: ArticleBase[];
      loadingArticles?: Readable<Promise<ArticleBase[]>>;
    }
    // interface Platform {}
  }
}

declare module "@fortawesome/free-solid-svg-icons/index.es" {
  export * from "@fortawesome/free-solid-svg-icons";
}

declare module "@fortawesome/free-regular-svg-icons/index.es" {
  export * from "@fortawesome/free-regular-svg-icons";
}

declare module "@fortawesome/free-brands-svg-icons/index.es" {
  export * from "@fortawesome/free-brands-svg-icons";
}

export {};
