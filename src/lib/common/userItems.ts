import { goto } from "$app/navigation";
import { PUBLIC_API_BASE } from "$env/static/public";
import type { ArticleSearchQuery } from "$shared/types/api";
import type { Collection, Feed, ItemBase, User } from "$shared/types/userItems";

export const sanitizeQuery = (query: ArticleSearchQuery) => {
  const keys = [
    "sort_by",
    "sort_order",
    "search_term",
    "first_date",
    "last_date",
  ] as const;
  for (const key of keys) {
    if (!Boolean(query[key])) {
      query[key] = undefined;
    }
  }

  return query;
};

export const removeable = (user: User | null, item: ItemBase) => {
  if (!user) return false;
  if (user.already_read == item._id) return false;

  return true;
};

type NavDest = "none" | "current" | "new";

export function createItem(
  feedName: string,
  contents: ArticleSearchQuery,
  type: "feed",
  navigate?: NavDest,
  subscribe?: boolean
): Promise<Feed | undefined>;
export function createItem(
  feedName: string,
  contents: string[],
  type: "collection",
  navigate?: NavDest,
  subscribe?: boolean
): Promise<Collection | undefined>;

export async function createItem(
  feedName: string,
  contents: ArticleSearchQuery | string[],
  type: "feed" | "collection",
  navigate: NavDest = "none",
  subscribe: boolean = true
): Promise<Feed | Collection | undefined> {
  const r = await fetch(
    `${PUBLIC_API_BASE}/my/${type}s/${encodeURIComponent(
      feedName
    )}?subscribe=${encodeURIComponent(subscribe)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contents),
    }
  );

  if (r.ok) {
    const item: Feed | Collection = await r.json();

    if (navigate === "current")
      await goto(`/feed/${item._id}`, { invalidateAll: true });
    else if (navigate === "new") window.open(`/feed/${item._id}`, "_blank");

    return item;
  } else {
    console.error(
      `Failed when attempting to create item with name "${feedName}". Status-code and message: ${r.status} ${r.statusText}`
    );
  }
}

export function updateItem(
  itemId: string,
  contents: ArticleSearchQuery,
  type: "feed",
  navigate?: NavDest
): Promise<Feed | undefined>;
export function updateItem(
  itemId: string,
  contents: string[],
  type: "collection",
  navigate?: NavDest
): Promise<Collection | undefined>;

export async function updateItem(
  itemId: string,
  contents: ArticleSearchQuery | string[],
  type: "feed" | "collection",
  navigate: NavDest = "none"
): Promise<Feed | Collection | undefined> {
  const r = await fetch(`${PUBLIC_API_BASE}/user-items/${type}/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contents),
  });

  if (r.ok) {
    const item: Feed | Collection = await r.json();

    if (navigate === "current")
      await goto(`/feed/${itemId}`, { invalidateAll: true });
    else if (navigate === "new") window.open(`/feed/${itemId}`, "_blank");

    return item;
  } else {
    console.error(
      `Failed when attempting to modify existing item using ID ${itemId}. Status-code and message: ${r.status} ${r.statusText}`
    );
  }
}

export const changeName = async (
  item: ItemBase,
  newName: string,
  navigate: NavDest = "none"
): Promise<boolean> => {
  const r = await fetch(
    `${PUBLIC_API_BASE}/user-items/${
      item._id
    }/name?new_name=${encodeURIComponent(newName)}`,
    {
      method: "PUT",
    }
  );

  if (r.ok) {
    if (navigate === "current")
      await goto(`/feed/${item._id}`, { invalidateAll: true });
    else if (navigate === "new") window.open(`/feed/${item._id}`, "_blank");
    return true;
  } else {
    console.error(
      `Failed when attempting to change name of item with ID ${item._id}. Status-code and message: ${r.status} ${r.statusText}`
    );
    return false;
  }
};
