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
  import { goto, invalidateAll } from "$app/navigation";
  import type { SearchQuery } from "$shared/types/api";
  import {
    changeName,
    updateItem,
    removeable,
    sanitizeQuery,
    createItem,
  } from "$lib/common/userItems";
  import type { Collection, Feed } from "$shared/types/userItems";
  import {
    faFileClipboard,
    faTrashCan,
  } from "@fortawesome/free-regular-svg-icons";

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
    ...(data.currentItem.owner === data.user?._id &&
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
                      "feed"
                    );
                    // Keept to avoid visual glitch with modal appearing and
                    // then removed by the afterNavigate hook in root layout
                    modalState.set({
                      modalType: null,
                      modalContent: null,
                    });
                    invalidateAll();
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
                goto("/feed", { invalidateAll: true });
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
                return;
              }
              const r = await fetch(
                `${PUBLIC_API_BASE}/my/${data.currentItem.type}s/subscription/${data.currentItem._id}`,
                { method: "PUT" }
              );

              if (r.ok) {
                invalidateAll();
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
      title = title.trim();
      await changeName(data.currentItem, title, "current");
    }
  };

  function keydown(e: any) {
    if (e.key === "Enter") {
      e.preventDefault();
      changeTitle();
    }
  }

  function keyup(e: any) {
    title = e.target.textContent;
  }
</script>

<HeaderShell
  title={data.currentItem.name}
  badge={data.currentItem.type}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
>
  <div class="relative" slot="title">
    <h1
      on:blur={changeTitle}
      on:keydown={keydown}
      on:keyup={keyup}
      class="
        lg:text-5xl sm:text-4xl text-3xl
        dark:text-white
        focus:outline-none
			"
      contenteditable={ownsFeed ? "true" : "false"}
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      data-gramm="false"
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

    &[contenteditable="true"] {
      @apply hover:after:scale-x-100 hover:after:origin-bottom-left
				focus:after:scale-x-100 focus:after:origin-bottom-left;
    }
  }
</style>
