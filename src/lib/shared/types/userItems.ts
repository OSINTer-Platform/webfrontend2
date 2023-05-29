import type { SearchQuery } from './api';

export interface ItemBase {
    _id: string;
    name: string;
    type: string;
    owner?: string;
}

export interface Collection extends ItemBase {
    ids: string[];
}

export type Feed = ItemBase & SearchQuery;

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

    feeds: Feed[];
    collections: Collection[];
}
