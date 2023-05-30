<script lang="ts">
    import type { LayoutData } from './$types';
    import type { Collection, Feed } from '$shared/types/userItems';

    import Sidebar from './sidebar.svelte';
    import { config } from '$shared/config';

    export let data: LayoutData;

    let feeds: Array<Feed>;
    $: feeds = data.feeds ? Object.values(data.feeds) : [];

    let collections: Array<Collection>;
    $: collections = data.collections ? Object.values(data.collections) : [];
</script>

<svelte:head>
    <title>OSINTer - Your feeds</title>
    <meta property="og:title" content="OSINTer - Your feeds" />
    <meta
        property="og:description"
        content="Curious on the newest happenings in the cybersecurity sphere? Well, look no further..."
    />
    <meta property="og:image" content={config.images.fullLogo} />
    <meta property="og:url" content="https://osinter.dk/feed" />
    <meta property="og:type" content="website" />
</svelte:head>

<Sidebar {feeds} {collections} user={data.user} />
<slot />
