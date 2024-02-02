// See https://kit.svelte.dev/docs/types#app

import type { User } from "$shared/types/userItems";
import type { Updatable } from "$lib/common/customStores";
import type { MLAvailability } from "$shared/types/api";
import type { Collection } from "$shared/types/userItems";

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
      user: User | null;
      customSidebar: boolean;
      alreadyRead: Updatable<Collection | null>;
      userCollections: Updatable<{ [key: string]: Collection }>;
      meta: {
        title?: string | { visual: string; meta: string };
        description?: string;
        image?: string;
        type?: string;
      };
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
