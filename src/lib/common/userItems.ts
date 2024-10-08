import { goto, invalidate, invalidateAll } from "$app/navigation";
import { PUBLIC_API_BASE } from "$env/static/public";
import type { ArticleSearchQuery } from "$shared/types/api";
import type {
  Collection,
  Feed,
  FeedItemBase,
  ItemBase,
} from "$shared/types/userItems";

export const sanitizeQuery = (query: ArticleSearchQuery) => {
  const keys = [
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

type NavDest = "none" | "invalidateAll" | `invalidate:${string}`;

type FeedItemNavDest = NavDest | "current" | "new";

async function nav(
  dest: FeedItemNavDest,
  id: string,
  genUrl = (id: string) => `/feed/${id}`
) {
  if (dest === "current") await goto(genUrl(id), { invalidateAll: true });
  else if (dest === "new") window.open(genUrl(id), "_blank");
  else if (dest === "invalidateAll") await invalidateAll();
  else if (dest.startsWith("invalidate:"))
    await invalidate(dest.split(":").slice(1).join(":"));
}

export function createItem(
  feedName: string,
  contents: ArticleSearchQuery,
  type: "feed",
  navigate?: FeedItemNavDest,
  subscribe?: boolean
): Promise<Feed | undefined>;
export function createItem(
  feedName: string,
  contents: string[],
  type: "collection",
  navigate?: FeedItemNavDest,
  subscribe?: boolean
): Promise<Collection | undefined>;

export async function createItem(
  feedName: string,
  contents: ArticleSearchQuery | string[],
  type: "feed" | "collection",
  navigate: FeedItemNavDest = "none",
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
    await nav(navigate, item._id);
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
  navigate?: FeedItemNavDest
): Promise<Feed | undefined>;
export function updateItem(
  itemId: string,
  contents: string[],
  type: "collection",
  navigate?: FeedItemNavDest
): Promise<Collection | undefined>;

export async function updateItem(
  itemId: string,
  contents: ArticleSearchQuery | string[],
  type: "feed" | "collection",
  navigate: FeedItemNavDest = "none"
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
    await nav(navigate, item._id);
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
  navigate: FeedItemNavDest = "none"
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
    await nav(navigate, item._id);
    return true;
  } else {
    console.error(
      `Failed when attempting to change name of item with ID ${item._id}. Status-code and message: ${r.status} ${r.statusText}`
    );
    return false;
  }
};

export const deleteItem = async (
  item: ItemBase,
  navigate: NavDest = "none"
): Promise<boolean> => {
  const r = await fetch(`${PUBLIC_API_BASE}/user-items/${item._id}`, {
    method: "DELETE",
  });

  if (r.ok) {
    await nav(navigate, item._id);
    return true;
  } else {
    console.error(
      `Failed when attempting to delete item with ID ${item._id}. Status-code and message: ${r.status} ${r.statusText}`
    );
    return false;
  }
};

export const modifySubscription = async (
  item: FeedItemBase,
  subscribe: boolean,
  navigate: FeedItemNavDest = "none"
): Promise<boolean> => {
  const r = await fetch(
    `${PUBLIC_API_BASE}/my/${item.type}s/subscription/${item._id}`,
    { method: subscribe ? "PUT" : "DELETE" }
  );

  if (r.ok) {
    await nav(navigate, item._id, (id: string) =>
      subscribe ? `/feed/${id}` : "/feed"
    );
    return true;
  } else return false;
};
