<script lang="ts">
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    import HeaderShell from '$com/article-list/header/shell.svelte';
    import type { HeaderModOptions } from '$shared/types/internal';

    import { faDownload } from '@fortawesome/free-solid-svg-icons/index';

    let modOptions: Array<HeaderModOptions>;

    $: modOptions = [
        {
            text: 'Download',
            icon: faDownload,
            route: `${data.currentItem.url.origin}${data.currentItem.url.pathname}/export${data.currentItem.url.search}`,
        },
    ];
</script>

<HeaderShell
    title={data.currentItem.title}
    badge={'Inbuilt feed'}
    description={data.currentItem.desc}
    {modOptions}
>
    <hr class="text-tertiary-600/50 sm:my-4" />
</HeaderShell>

<slot />
