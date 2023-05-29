<script lang="ts">
    import SearchFields from '$com/search/main.svelte';
    import type { PageData } from './$types';

    import { config } from '$shared/config';
    import type { SearchQuery } from '$shared/types/api';
    export let data: PageData;

    export let searchQuery: SearchQuery;
</script>

<svelte:head>
    <title>OSINTer - Search in articles</title>
    <meta
        property="og:title"
        content="OSINTer - Search for available articles"
    />
    <meta
        property="og:description"
        content="Here it's possible to search in the articles stored in this instance of OSINTer"
    />
    <meta property="og:image" content={config.images.fullLogo} />
    <meta property="og:url" content="https://osinter.dk/search" />
    <meta property="og:type" content="website" />
</svelte:head>

<form action="/feed/search" method="get" class="h-full">
    <SearchFields sourceCategories={data.sourceCategories} bind:searchQuery>
        <svelte:fragment slot="main-button">
            <button
                class="grow btn
			">Search Content</button
            >
        </svelte:fragment>
    </SearchFields>
</form>
