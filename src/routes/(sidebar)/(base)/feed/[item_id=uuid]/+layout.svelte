<script lang="ts">
  import type { LayoutData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";

  import ItemDescriptor from "$com/itemDescriptor/main.svelte";
  import HeaderShell from "$com/itemList/header/shell.svelte";
  import Editable from "$com/utils/inputs/editable/editable.svelte";
  import EditableWrapper from "$com/utils/inputs/editable/wrapper.svelte";

  import { feedLocalSearch } from "$state/state";
  import { modalState } from "$state/modals";

  import {
    faDiagramProject,
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
  import { modifyFeed } from "$lib/common/modals";

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

  let ownsFeed: boolean;
  $: ownsFeed = data.currentItem.owner === $user?._id;

  $: webhookLimits = $page.data.webhookLimits;

  $: modOptions = [
    ...(ownsFeed &&
    data.currentItem.type === "feed" &&
    $webhookLimits.max_count > 0 &&
    $webhookLimits.max_feeds_per_hook > 0
      ? [
          {
            title: "Attach webhook",
            icon: faDiagramProject,
            action: () => {
              const feed = data.currentItem as Feed;
              if (feed.sort_order != "desc" || feed.sort_by != "publish_date")
                modalState.append({
                  modalType: "options",
                  modalContent: {
                    type: "error",
                    title: "Feed isn't sorted right",
                    description: `Your feed "${feed.name}" is not sorted by publish date in descending order, and needs to be when attaching webhook.`,
                    options: [
                      {
                        text: "Modify feed",
                        type: "primary",
                        action: () => modifyFeed(feed),
                      },
                      {
                        text: "Cancel",
                        type: "secondary",
                        action: () => {},
                      },
                    ],
                  },
                });
              else
                modalState.append({
                  modalType: "attach-webhooks",
                  modalContent: {
                    feed: data.currentItem as Feed,
                  },
                });
            },
          },
        ]
      : []),
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
          await createItem(
            `Copy of "${data.currentItem.name}"`,
            data.currentItem,
            "feed",
            "current"
          );
        } else if (isCollection(data.currentItem)) {
          await createItem(
            `Copy of "${data.currentItem.name}"`,
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
            action: () => modifyFeed(data.currentItem as Feed),
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
              await modifySubscription(data.currentItem, true, "invalidateAll");
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
  <svelte:fragment slot="title">
    {#if ownsFeed}
      <EditableWrapper class="flex gap-4 items-center">
        <Editable
          tag="h1"
          content={data.currentItem.name}
          class="lg:text-5xl sm:text-4xl text-3xl link-underline"
          on:commit={(e) => changeName(data.currentItem, e.detail, "current")}
        />
      </EditableWrapper>
    {:else}
      <h1 class="lg:text-5xl sm:text-4xl text-3xl">
        {data.currentItem.name}
      </h1>
    {/if}
  </svelte:fragment>
  <ItemDescriptor
    currentItem={data.currentItem}
    categories={data.sourceCategories}
  />
</HeaderShell>

<slot />
