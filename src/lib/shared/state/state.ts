import type {
  CollectionSortBy,
  ItemSortBy,
  WebhookSortBy,
} from "$lib/common/sort";
import { persisted } from "svelte-persisted-store";
import { writable, type Writable } from "svelte/store";

// For controlling if the sidebar is open on small screens
export const sideOpen: Writable<Boolean> = writable(false);
// For controlling the submenus in the sidebar using the ID of the submenu as the key
export const sideMenuOpen: Writable<{ [key: string]: Boolean }> = persisted(
  "sidebar-open",
  {}
);

export const feedLocalSearch = writable("");
export const showRead = writable(true);
export const showHighlights = writable(true);
export const expandHighlights = writable(false);
export const expandSummary = writable(false);

export const listElementCount = writable(0);

export const tooltip = writable<null | {
  padding?: number;
  text: string | { title: string; description: string };
  x: number;
  y: number;
}>(null);

export const feedSortBy = writable<ItemSortBy>("creationTime");
export const collectionSortBy = writable<CollectionSortBy>("creationTime");
export const webhookSortBy = writable<WebhookSortBy>("creationTime");
