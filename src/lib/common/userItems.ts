import { goto } from '$app/navigation';
import { PUBLIC_API_BASE } from '$env/static/public';
import type { SearchQuery } from '$shared/types/api';
import type { Feed, ItemBase } from '$shared/types/userItems';

export const sanitizeQuery = (query: SearchQuery) => {
    const keys = [
        'sort_by',
        'sort_order',
        'search_term',
        'first_date',
        'last_date',
    ] as const;
    for (const key of keys) {
        if (!Boolean(query[key])) {
            query[key] = undefined;
        }
    }

    return query;
};

export const createFeed = async (
    feedName: string,
    contents: SearchQuery,
    navigate: boolean = false
): Promise<Feed | undefined> => {
    const r = await fetch(
        `${PUBLIC_API_BASE}/my/feeds/${encodeURIComponent(feedName)}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contents),
        }
    );

    if (r.ok) {
        const feed: Feed = await r.json();
        if (navigate) await goto(`/feed/${feed._id}`);
        return feed;
    } else {
        console.error(
            `Failed when attempting to create feed. Status-code and message: ${r.status} ${r.statusText}`
        );
    }
};

export const updateFeed = async (
    feedId: string,
    contents: SearchQuery,
    navigate: boolean = false
): Promise<boolean> => {
    const r = await fetch(`${PUBLIC_API_BASE}/user-items/feed/${feedId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contents),
    });

    if (r.ok) {
        if (navigate) await goto(`/feed/${feedId}`);
        return true;
    } else {
        console.error(
            `Failed when attempting to modify existing feed using ID ${feedId}. Status-code and message: ${r.status} ${r.statusText}`
        );
        return false;
    }
};

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
            method: 'PUT',
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
