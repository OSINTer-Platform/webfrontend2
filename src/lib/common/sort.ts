import type { Collection, ItemBase, Webhook } from "$shared/types/userItems";

export function sortDocumentsById<Document>(
  ids: string[],
  documents: Document[],
  getId: (doc: Document) => string
) {
  const lookupTable: { [key: string]: number } = Object.fromEntries(
    ids.map((id, i) => [id, i])
  );
  const filteredDocuments = documents.filter(
    (document) => getId(document) in lookupTable
  );

  filteredDocuments.sort(
    (a, b) => lookupTable[getId(a)] - lookupTable[getId(b)]
  );
  return filteredDocuments;
}

export function shuffle<T>(list: T[]): T[] {
  var i = list.length;

  while (--i > 0) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = list[j];
    list[j] = list[i];
    list[i] = temp;
  }

  return list;
}

export type ItemSortBy = "creationTime" | "name";
export type WebhookSortBy = ItemSortBy | "attachedCount";
export type CollectionSortBy = ItemSortBy | "articleCount";

const compareCreationTime = (a: ItemBase, b: ItemBase) =>
  new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime();

export function sortUserItems<ItemType extends ItemBase>(
  items: ItemType[],
  sortBy: ItemSortBy
): ItemType[] {
  if (sortBy === "name")
    return items.toSorted(
      (a, b) => a.name.localeCompare(b.name) || compareCreationTime(a, b)
    );
  else if (sortBy === "creationTime")
    return items.toSorted(compareCreationTime);
  else return items;
}

export function sortWebhooks(webhooks: Webhook[], sortBy: WebhookSortBy) {
  if (sortBy === "creationTime" || sortBy === "name")
    return sortUserItems(webhooks, sortBy);
  else if (sortBy === "attachedCount")
    return webhooks.toSorted(
      (a, b) =>
        b.attached_feeds.length - a.attached_feeds.length ||
        compareCreationTime(a, b)
    );
  else return webhooks;
}

export function sortCollections(
  collections: Collection[],
  sortBy: CollectionSortBy
) {
  if (sortBy === "creationTime" || sortBy === "name")
    return sortUserItems(collections, sortBy);
  else if (sortBy === "articleCount")
    return collections.toSorted(
      (a, b) => b.ids.length - a.ids.length || compareCreationTime(a, b)
    );
  else return collections;
}
