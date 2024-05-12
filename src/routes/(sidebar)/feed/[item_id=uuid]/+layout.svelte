<script lang="ts">
  import type { LayoutData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";

  import ItemDescriptor from "$com/itemDescriptor/main.svelte";
  import HeaderShell from "$com/itemList/header/shell.svelte";
  import Editable from "$com/utils/inputs/editable.svelte";

  import { feedLocalSearch } from "$state/state";
  import { modalState } from "$state/modals";

  import {
    faDownload,
    faPenToSquare,
    faPlus,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons/index";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { goto, invalidateAll } from "$app/navigation";
  import type { ArticleSearchQuery } from "$shared/types/api";
  import {
    changeName,
    updateItem,
    sanitizeQuery,
    createItem,
    modifySubscription,
  } from "$lib/common/userItems";
  import type { Collection, Feed } from "$shared/types/userItems";
  import {
    faFileClipboard,
    faTrashCan,
  } from "@fortawesome/free-regular-svg-icons";
  import { page } from "$app/stores";

  export let data: LayoutData;

  $: user = data.user;

  function isFeed(item: Feed | Collection): item is Feed {
    return item.type == "feed";
  }

  function isCollection(item: Feed | Collection): item is Collection {
    return item.type == "collection";
  }

  let modOptions: Array<HeaderModOptions>;

  $: itemRemoveable =
    $user &&
    ($user.feed_ids.includes(data.currentItem._id) ||
      $user.collection_ids.includes(data.currentItem._id));

  $: modOptions = [
    ...($page.data.articles && $page.data.articles.length > 0
      ? [
          {
            title: "Download",
            icon: faDownload,
            route: `${PUBLIC_API_BASE}/user-items/${data.currentItem._id}/export`,
            options: {
              download: "true",
            },
          },
        ]
      : []),
    {
      title: `Copy ${data.currentItem.type}`,
      icon: faFileClipboard,
      action: async () => {
        if (isFeed(data.currentItem)) {
          await createItem("Copied Feed", data.currentItem, "feed", "current");
        } else if (isCollection(data.currentItem)) {
          await createItem(
            "Copied Collection",
            data.currentItem.ids,
            "collection",
            "current"
          );
        }
      },
    },
    ...(data.currentItem.owner === $user?._id &&
    data.currentItem.type === "collection"
      ? [
          {
            title: "Empty collection",
            icon: faTrashCan,
            action: async () => {
              const r = await updateItem(
                data.currentItem._id,
                [],
                "collection"
              );
              if (r) invalidateAll();
            },
          },
        ]
      : []),
    ...(data.currentItem.owner === $user?._id && data.currentItem.type == "feed"
      ? [
          {
            title: `Modify ${data.currentItem.type}`,
            icon: faPenToSquare,
            action: () => {
              modalState.append({
                modalType: "search",
                modalContent: {
                  searchText: "Update feed",
                  searchAction: async (query: ArticleSearchQuery) => {
                    await updateItem(
                      data.currentItem._id,
                      sanitizeQuery(query),
                      "feed"
                    );
                    // Keept to avoid visual glitch with modal appearing and
                    // then removed by the afterNavigate hook in root layout
                    modalState.set([]);
                    invalidateAll();
                  },
                  query: data.currentItem as Feed,
                },
              });
            },
          },
        ]
      : []),
    ...(itemRemoveable
      ? [
          {
            title: `Remove ${data.currentItem.type}`,
            icon: faXmark,
            action: async () =>
              modifySubscription(data.currentItem, false, "current"),
          },
        ]
      : [
          {
            title: `Sub to ${data.currentItem.type}`,
            icon: faPlus,
            action: async () => {
              if (!$user) {
                goto(
                  `/login?msg=${encodeURIComponent(
                    "Login down below for the ability to subscribe to and personalize feeds"
                  )}`
                );
                return;
              }
              await modifySubscription(data.currentItem, true, "invalidate");
            },
          },
        ]),
  ];

  let ownsFeed: boolean;
  let title: string = data.currentItem.name;

  $: ownsFeed = data.currentItem.owner === $user?._id;
</script>

<HeaderShell
  title={data.currentItem.name}
  badge={data.currentItem.type}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
>
  <svelte:fragment slot="title">
    {#if ownsFeed}
      <Editable
        on:commit={(e) => changeName(data.currentItem, e.detail, "current")}
        tag="h1"
        class="lg:text-5xl sm:text-4xl text-3xl"
        content={title}
      />
    {:else}
      <h1 class="lg:text-5xl sm:text-4xl text-3xl">
        {title}
      </h1>
    {/if}
  </svelte:fragment>
  <ItemDescriptor
    currentItem={data.currentItem}
    categories={data.sourceCategories}
  />
</HeaderShell>

<slot />
