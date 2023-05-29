<script lang="ts">
    import type { LayoutData } from './$types';
    import type { HeaderModOptions } from '$shared/types/internal';

    import ItemDescriptor from '../itemDescriptor/main.svelte';
    import HeaderShell from '$com/article-list/header/shell.svelte';

    import { feedLocalSearch } from '$state/state';
    import {
        faDownload,
        faPenToSquare,
        faXmark,
    } from '@fortawesome/free-solid-svg-icons/index';
    import { PUBLIC_API_BASE } from '$env/static/public';
    import { goto } from '$app/navigation';

    export let data: LayoutData;

    let modOptions: Array<HeaderModOptions>;

    $: modOptions = [
        {
            title: 'Download',
            icon: faDownload,
            route: `${PUBLIC_API_BASE}/user-items/${data.currentItem._id}/export`,
        },
        ...(data.user.feed_ids.includes(data.currentItem._id)
            ? [
                  {
                      title: `Remove ${data.currentItem.type}`,
                      icon: faXmark,
                      action: async () => {
                          const r = await fetch(
                              `${PUBLIC_API_BASE}/my/${data.currentItem.type}s/subscription/${data.currentItem._id}`,
                              { method: 'DELETE' }
                          );

                          if (r.ok) {
                              goto('/feed');
                          }
                      },
                  },
              ]
            : []),
    ];
</script>

<HeaderShell
    title={data.currentItem.name}
    badge={data.currentItem.type}
    {modOptions}
    bind:searchValue={$feedLocalSearch}
>
    <ItemDescriptor
        currentItem={data.currentItem}
        categories={data.sourceCategories}
    />
</HeaderShell>

<slot />
