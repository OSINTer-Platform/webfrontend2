import { goto } from "$app/navigation";
import { PUBLIC_API_BASE } from "$env/static/public";
import type { SearchQuery } from "$shared/types/api";
import type { Collection, Feed, ItemBase } from "$shared/types/userItems";

export const sanitizeQuery = (query: SearchQuery) => {
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

export function createItem(
  feedName: string,
  contents: SearchQuery,
  type: "feed",
  navigate: boolean
): Promise<Feed | undefined>;
export function createItem(
  feedName: string,
  contents: string[],
  type: "collection",
  navigate: boolean
): Promise<Collection | undefined>;

export async function createItem(
  feedName: string,
  contents: SearchQuery | string[],
  type: "feed" | "collection",
  navigate: boolean = false
): Promise<Feed | Collection | undefined> {
  const r = await fetch(
    `${PUBLIC_API_BASE}/my/${type}s/${encodeURIComponent(feedName)}`,
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
    if (navigate) await goto(`/feed/${item._id}`);
    return item;
  } else {
    console.error(
      `Failed when attempting to create item with name "${feedName}". Status-code and message: ${r.status} ${r.statusText}`
    );
  }
}

export function updateItem(
  itemId: string,
  contents: SearchQuery,
  type: "feed",
  navigate: boolean
): Promise<Feed | undefined>;
export function updateItem(
  itemId: string,
  contents: string[],
  type: "collection",
  navigate: boolean
): Promise<Collection | undefined>;

export async function updateItem(
  itemId: string,
  contents: SearchQuery | string[],
  type: "feed" | "collection",
  navigate: boolean = false
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
    if (navigate) await goto(`/feed/${itemId}`);
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
  navigate: boolean = false
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
    if (navigate) await goto(`/feed/${item._id}`);
    return true;
  } else {
    console.error(
      `Failed when attempting to change name of item with ID ${item._id}. Status-code and message: ${r.status} ${r.statusText}`
    );
    return false;
  }
};
