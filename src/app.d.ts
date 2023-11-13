// See https://kit.svelte.dev/docs/types#app

import type { User } from "$shared/types/userItems";

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
    // interface PageData {}
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
