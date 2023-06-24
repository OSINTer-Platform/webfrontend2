<script lang="ts">
  import type { LayoutData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";

  import ItemDescriptor from "../itemDescriptor/main.svelte";
  import HeaderShell from "$com/article-list/header/shell.svelte";

  import { feedLocalSearch, modalState } from "$state/state";
  import {
    faDownload,
    faPenToSquare,
    faPlus,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons/index";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { goto } from "$app/navigation";
  import type { SearchQuery } from "$shared/types/api";
  import {
    changeName,
    updateItem,
    removeable,
    sanitizeQuery,
    createItem,
  } from "$lib/common/userItems";
  import type { Collection, Feed } from "$shared/types/userItems";
  import { faFileClipboard } from "@fortawesome/free-regular-svg-icons";

  export let data: LayoutData;

  function isFeed(item: Feed | Collection): item is Feed {
    return item.type == "feed";
  }

  function isCollection(item: Feed | Collection): item is Collection {
    return item.type == "collection";
  }

  let modOptions: Array<HeaderModOptions>;

  $: itemRemoveable =
    data.user &&
    (data.user.feed_ids.includes(data.currentItem._id) ||
      data.user.collection_ids.includes(data.currentItem._id)) &&
    removeable(data.user, data.currentItem);

  $: itemSubscribeable =
    !itemRemoveable && removeable(data.user, data.currentItem);

  $: modOptions = [
    {
      title: "Download",
      icon: faDownload,
      route: `${PUBLIC_API_BASE}/user-items/${data.currentItem._id}/export`,
    },
    {
      title: `Copy ${data.currentItem.type}`,
      icon: faFileClipboard,
      action: async () => {
        if (isFeed(data.currentItem)) {
          await createItem("Copied Feed", data.currentItem, "feed", true);
        } else if (isCollection(data.currentItem)) {
          await createItem(
            "Copied Collection",
            data.currentItem.ids,
            "collection",
            true
          );
        }
        location.reload();
      },
    },
    ...(data.currentItem.owner === data.user?._id &&
    data.currentItem.type == "feed"
      ? [
          {
            title: `Modify ${data.currentItem.type}`,
            icon: faPenToSquare,
            action: () => {
              $modalState = {
                modalType: "search",
                modalContent: {
                  searchText: "Update feed",
                  searchAction: async (query: SearchQuery) => {
                    await updateItem(
                      data.currentItem._id,
                      sanitizeQuery(query),
                      "feed",
                      false
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
    ...(itemRemoveable
      ? [
          {
            title: `Remove ${data.currentItem.type}`,
            icon: faXmark,
            action: async () => {
              const r = await fetch(
                `${PUBLIC_API_BASE}/my/${data.currentItem.type}s/subscription/${data.currentItem._id}`,
                { method: "DELETE" }
              );

              if (r.ok) {
                goto("/feed");
              }
            },
          },
        ]
      : []),
    ...(itemSubscribeable
      ? [
          {
            title: `Sub to ${data.currentItem.type}`,
            icon: faPlus,
            action: async () => {
              if (!data.user) {
                goto(
                  `/login?msg=${encodeURIComponent(
                    "Login down below for the ability to subscribe to and personalize feeds"
                  )}`
                );
              }
              const r = await fetch(
                `${PUBLIC_API_BASE}/my/${data.currentItem.type}s/subscription/${data.currentItem._id}`,
                { method: "PUT" }
              );

              if (r.ok) {
                location.reload();
              }
            },
          },
        ]
      : []),
  ];

  let ownsFeed: boolean;
  let title: string = data.currentItem.name;

  $: ownsFeed = data.currentItem.owner === data.user?._id;

  const setTitle = (newVal: string) => (title = newVal);

  $: setTitle(data.currentItem.name);

  const changeTitle = async () => {
    if (title !== data.currentItem.name) {
      title = title.trim().replaceAll("  ", " ");
      await changeName(data.currentItem, title, false);
      location.reload();
    }
  };
</script>

<HeaderShell
  title={data.currentItem.name}
  badge={data.currentItem.type}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
>
  <div class="relative" slot="title">
    {#if ownsFeed}
      <input
        type="text"
        on:blur={changeTitle}
        on:keydown={async (e) => {
          if (e.key === "Enter") {
            changeTitle();
          } else if (title.length > 25) {
            title = title.slice(0, 24);
          }
        }}
        maxlength="25"
        bind:value={title}
        class="
				absolute
				h-full w-full
				bg-transparent
				lg:text-5xl sm:text-4xl text-3xl
				dark:text-white
				outline-none

				peer
			"
      />
    {/if}
    <h1
      class="
				lg:text-5xl sm:text-4xl text-3xl
				whitespace-pre
				{ownsFeed ? 'text-transparent' : 'dark:text-white'}
				peer-hover:after:scale-x-100 peer-hover:after:origin-bottom-left
				peer-focus:after:scale-x-100 peer-focus:after:origin-bottom-left
			"
    >
      {title}
    </h1>
  </div>
  <ItemDescriptor
    currentItem={data.currentItem}
    categories={data.sourceCategories}
  />
</HeaderShell>

<slot />

<style lang="postcss">
  h1 {
    &:after {
      content: "";
      @apply block
			w-full h-px
			text-black dark:text-white

			scale-x-0 origin-bottom-right
			transition-transform duration-300
			bg-current;
    }
  }
</style>