import { goto } from '$app/navigation';
import { PUBLIC_API_BASE } from '$env/static/public';
import type { SearchQuery } from '$shared/types/api';
import type { Feed } from '$shared/types/userItems';

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
