<script lang="ts">
    import type { LayoutData } from './$types';
    import type { HeaderModOptions } from '$shared/types/internal';

    import ItemDescriptor from '../itemDescriptor/main.svelte';
    import HeaderShell from '$com/article-list/header/shell.svelte';

    import { feedLocalSearch, modalState } from '$state/state';
    import {
        faDownload,
        faPenToSquare,
        faPlus,
        faXmark,
    } from '@fortawesome/free-solid-svg-icons/index';
    import { PUBLIC_API_BASE } from '$env/static/public';
    import { goto } from '$app/navigation';
    import type { SearchQuery } from '$shared/types/api';
    import { updateFeed, sanitizeQuery } from '$lib/common/userItems';
    import type { Feed } from '$shared/types/userItems';

    export let data: LayoutData;

    let modOptions: Array<HeaderModOptions>;

    $: modOptions = [
        {
            title: 'Download',
            icon: faDownload,
            route: `${PUBLIC_API_BASE}/user-items/${data.currentItem._id}/export`,
        },
        ...(data.currentItem.owner === data.user?._id &&
        data.currentItem.type == 'feed'
            ? [
                  {
                      title: `Modify ${data.currentItem.type}`,
                      icon: faPenToSquare,
                      action: () => {
                          $modalState = {
                              modalType: 'search',
                              modalContent: {
                                  searchText: 'Update feed',
                                  searchAction: async (query: SearchQuery) => {
                                      await updateFeed(
                                          data.currentItem._id,
                                          sanitizeQuery(query)
                                      );
                                      modalState.set({
                                          modalType: null,
                                          modalContent: null,
                                      });
                                      location.reload();
                                  },
                                  query: data.currentItem as Feed,
                              },
                          };
                      },
                  },
              ]
            : []),
        ...(data.user?.feed_ids.includes(data.currentItem._id)
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
            : [
                  {
                      title: `Sub to ${data.currentItem.type}`,
                      icon: faPlus,
                      action: async () => {
                          if (!data.user) {
                              goto(
                                  `/login?msg=${encodeURIComponent(
                                      'Login down below for the ability to subscribe to and personalize feeds'
                                  )}`
                              );
                          }
                          const r = await fetch(
                              `${PUBLIC_API_BASE}/my/${data.currentItem.type}s/subscription/${data.currentItem._id}`,
                              { method: 'PUT' }
                          );

                          if (r.ok) {
                              location.reload();
                          }
                      },
                  },
              ]),
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
