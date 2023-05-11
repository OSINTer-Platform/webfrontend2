<script lang="ts">
    import type { LayoutData } from './$types';
    import type { HeaderModOptions } from '$shared/types/internal';

    import FeedRender from '../itemDescriptor/feed.svelte';
    import HeaderShell from '$com/article-list/header/shell.svelte';

    import { feedLocalSearch } from '$state/state';
    import { faDownload } from '@fortawesome/free-solid-svg-icons/index';
    import { PUBLIC_API_BASE } from '$env/static/public';

    export let data: LayoutData;

    let modOptions: Array<HeaderModOptions>;

    $: modOptions = [
        {
            title: 'Download',
            icon: faDownload,
            route: `${PUBLIC_API_BASE}/articles/search/export?${data.searchUrl}`,
        },
    ];
</script>

<HeaderShell
    title={'Custom search'}
    badge={'Search'}
    {modOptions}
    bind:searchValue={$feedLocalSearch}
>
    <hr class="my-4 border-tertiary-700/50" />
    <FeedRender
        currentItem={data.currentSearch}
        categories={data.sourceCategories}
    />
    <hr class="my-4 border-tertiary-700/50" />
</HeaderShell>

<slot />
