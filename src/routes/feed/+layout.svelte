<script lang="ts">
    import type { LayoutData } from './$types';
    import type { Collection, Feed } from '$shared/types/userItems';

    import Sidebar from './sidebar.svelte';

    export let data: LayoutData;

    let feeds: Array<Feed>;
    $: feeds = data.feeds ? Object.values(data.feeds) : [];

    let collections: Array<Collection>;
    $: collections = data.collections ? Object.values(data.collections) : [];
</script>

<Sidebar {feeds} {collections} />
<slot />
