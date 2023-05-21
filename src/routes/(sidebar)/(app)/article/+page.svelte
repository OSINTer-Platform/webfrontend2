<script lang="ts">
    import type { HeaderModOptions } from '$shared/types/internal';

    import HeaderShell from '$com/article-list/header/shell.svelte';
    import List from '$com/article-list/wrapper.svelte';

    import {
        filteredArticles,
        fullArticles,
        localSearch,
    } from '$state/storedArticles';
    import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
    import { config } from '$shared/config';

    const modOptions: Array<HeaderModOptions> = [
        {
            title: 'Clear stored',
            icon: faTrashCan,
            action: () => fullArticles.set({}),
        },
    ];
</script>

<svelte:head>
    <title>OSINTer - Article List</title>
    <meta property="og:title" content="OSINTer - Your Article List" />
    <meta
        property="og:description"
        content="A list of the articles you have recently viewed in OSINTer"
    />
    <meta property="og:image" content={config.images.fullLogo} />
    <meta property="og:url" content="https://osinter.dk/article" />
    <meta property="og:type" content="website" />
</svelte:head>

<HeaderShell
    title={'Stored articles'}
    description={'A list of the articles you have recently viewed in OSINTer'}
    {modOptions}
    bind:searchValue={$localSearch}
/>

<List articles={$filteredArticles} />
