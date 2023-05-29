import { goto } from '$app/navigation';
import { PUBLIC_API_BASE } from '$env/static/public';
import type { SearchQuery } from '$shared/types/api';
import type { Feed } from '$shared/types/userItems';

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
        if (navigate) goto(`/feed/${feed._id}`);
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
): Promise<null | undefined> => {
    const r = await fetch(`${PUBLIC_API_BASE}/user-items/feed/${feedId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contents),
    });

    if (r.ok) {
        if (navigate) goto(`/feed/${feedId}`);
        return null;
    } else {
        console.error(
            `Failed when attempting to modify existing feed using ID ${feedId}. Status-code and message: ${r.status} ${r.statusText}`
        );
    }
};
