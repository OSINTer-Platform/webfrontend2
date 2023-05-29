<script lang="ts">
    import SearchFields from '$com/search/main.svelte';
    import Fa from 'svelte-fa/src/fa.svelte';

    import {
        faArrowsRotate,
        faDownload,
        faPlus,
    } from '@fortawesome/free-solid-svg-icons';
    import type { PageData } from './$types';

    import { config, getStandardSearch } from '$shared/config';
    import { PUBLIC_API_BASE } from '$env/static/public';
    import type { SearchQuery } from '$shared/types/api';
    import { createFeed, sanitizeQuery } from '$lib/common/userItems';

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

        <svelte:fragment slot="side-buttons">
            <button
                class="btn"
                on:click={() => {
                    createFeed('New feed', sanitizeQuery(searchQuery), true);
                }}><Fa icon={faPlus} /></button
            >

            <button
                class="btn"
                formaction="{PUBLIC_API_BASE}/articles/search/export"
            >
                <Fa icon={faDownload} />
            </button>

            <button
                type="button"
                class="btn"
                on:click={() => (searchQuery = getStandardSearch())}
            >
                <Fa icon={faArrowsRotate} />
            </button>
        </svelte:fragment>
    </SearchFields>
</form>
