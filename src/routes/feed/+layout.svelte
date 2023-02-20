<script lang="ts">
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    import Sidebar from '$com/sidebar/feed.svelte';

    const feeds = [
        {
            id: 'tesdfdsf',
            name: 'hest',
        },
    ];
</script>

<div class="flex flex-row min-h-0">
    <Sidebar {feeds} />
    <slot />
</div>
