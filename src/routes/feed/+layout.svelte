<script lang="ts">
    import type { LayoutData } from './$types';
    import type { Collection, Feed } from '$shared/types';

    import Sidebar from '$com/sidebar/feed.svelte';

    export let data: LayoutData;

    let feeds: Array<Feed>;
    $: feeds = data.feeds ? Object.values(data.feeds) : [];

    let collections: Array<Collection>;
    $: collections = data.collections ? Object.values(data.collections) : [];
</script>

<div class="flex flex-row flex-grow items-stretch min-h-0">
    <Sidebar {feeds} {collections} />
    <slot />
</div>
