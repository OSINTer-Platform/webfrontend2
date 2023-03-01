<script lang="ts">
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    import { config } from '$shared/config';
    import ItemDescriptor from '../itemDescriptor/main.svelte';
    import HeaderShell from '$com/article-list/header/shell.svelte';

    import {
        faDownload,
        faPenToSquare,
    } from '@fortawesome/free-solid-svg-icons/index';
    import type { HeaderModOptions } from '$shared/types/internal';

    let modOptions: Array<HeaderModOptions>;

    $: modOptions = [
        {
            text: 'Download',
            icon: faDownload,
            route: `${config.apiRoot}/user-items/${data.currentItem._id}/export`,
        },
        {
            text: `Modify ${data.currentItem.type}`,
            icon: faPenToSquare,
            action: () => {},
        },
    ];
</script>

<HeaderShell
    title={data.currentItem.name}
    badge={data.currentItem.type}
    {modOptions}
>
    <ItemDescriptor
        currentItem={data.currentItem}
        categories={data.sourceCategories}
    />
</HeaderShell>

<slot />
