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

    const modOptions: Array<HeaderModOptions> = [
        {
            text: 'Clear stored',
            icon: faTrashCan,
            action: () => fullArticles.set({}),
        },
    ];
</script>

<HeaderShell
    title={'Stored articles'}
    description={'A list of the articles you have recently viewed in OSINTer'}
    {modOptions}
    bind:searchValue={$localSearch}
>
    <hr class="text-tertiary-600/50 sm:my-4" />
</HeaderShell>

<List articles={$filteredArticles} />
