<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import {
    changeName,
    createItem,
    modifySubscription,
    sanitizeQuery,
    updateItem,
  } from "$lib/common/userItems";
  import { modalState } from "$shared/state/modals";
  import {
    faPenToSquare,
    faXmark,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons";
  import {
    faFileClipboard,
    faTrashCan,
  } from "@fortawesome/free-regular-svg-icons";
  import { v4 as uuid } from "uuid";
  import { onMount } from "svelte";

  import type { ArticleSearchQuery } from "$shared/types/api";
  import type { Collection, Feed } from "$shared/types/userItems";
  import type { PageData } from "./$types";

  import ItemList from "./itemList.svelte";
  import { sortCollections, sortUserItems } from "$lib/common/sort";
  import { collectionSortBy, feedSortBy } from "$shared/state/state";

  export let data: PageData;

  $: user = data.user;

  async function changeTitle(item: Collection | Feed, newTitle: string) {
    await changeName(item, newTitle, "none");
    await invalidateAll();
  }

  $: feedItems = sortUserItems(Object.values(data.feeds), $feedSortBy).map(
    (feed) => {
      const own = feed.owner === $user?._id;

      const actions: {
        title: string;
        icon: IconDefinition;
        requireOwn: boolean;
        action: () => void;
      }[] = [
        {
          title: "Copy feed",
          icon: faFileClipboard,
          requireOwn: false,
          action: () =>
            createItem(`Copy of "${feed.name}"`, feed, "feed", "invalidateAll"),
        },
        {
          title: "Modify feed",
          icon: faPenToSquare,
          requireOwn: true,
          action: () => {
            const modalId = uuid();
            modalState.append({
              id: modalId,
              modalType: "search",
              modalContent: {
                searchText: "Update feed",
                searchAction: async (query: ArticleSearchQuery) => {
                  const r = await updateItem(
                    feed._id,
                    sanitizeQuery(query),
                    "feed",
                    "invalidateAll"
                  );

                  if (r) modalState.remove(modalId);
                },
                query: feed,
              },
            });
          },
        },
        {
          title: "Remove feed",
          icon: faXmark,
          requireOwn: false,
          action: () => modifySubscription(feed, false, "invalidateAll"),
        },
      ];

      return {
        title: feed.name,
        description: {
          primary: `${own ? "Created" : "Not created"} by you`,
        },
        href: `/feed/${feed._id}`,
        titleEdit: own
          ? (newTitle: string) => changeTitle(feed, newTitle)
          : undefined,
        actions,
        checked: false,
        own,
        item: feed,
      };
    }
  );

  $: collectionItems = sortCollections(
    Object.values(data.collections),
    $collectionSortBy
  ).map((collection) => {
    const actions: {
      title: string;
      icon: IconDefinition;
      requireOwn: boolean;
      action: () => void;
    }[] = [
      {
        title: "Copy collection",
        icon: faFileClipboard,
        requireOwn: false,
        action: () =>
          createItem(
            `Copy of "${collection.name}"`,
            collection.ids,
            "collection",
            "invalidateAll"
          ),
      },
      {
        title: "Empty collection",
        icon: faTrashCan,
        requireOwn: true,
        action: () =>
          updateItem(collection._id, [], "collection", "invalidateAll"),
      },
      {
        title: "Remove collection",
        icon: faXmark,
        requireOwn: false,
        action: () => modifySubscription(collection, false, "invalidateAll"),
      },
    ];
    const own = collection.owner === $user?._id;
    return {
      title: collection.name,
      description: {
        primary: `${own ? "Created" : "Not created"} by you`,
        secondary: `${collection.ids.length} articles`,
      },
      href: `/feed/${collection._id}`,
      titleEdit: own
        ? (newTitle: string) => changeTitle(collection, newTitle)
        : undefined,
      actions,
      checked: false,
      own,
      item: collection,
    };
  });

  const feedActions = [
    {
      title: "Remove feeds",
      icon: faXmark,
      action: async (items: Feed[]) => {
        modalState.append({
          modalType: "options",
          modalContent: {
            type: "error",
            title: "Remove feeds?",
            description:
              "Are you sure you want to unsubscribe from these feeds? It will remove them from your page, but they will still be available to others.",
            options: async () => {
              for (const item of items) {
                await modifySubscription(item, false, "none");
              }
              await invalidateAll();
            },
          },
        });
        return false;
      },
      requireOwn: false,
    },
  ];

  const collectionActions = [
    {
      title: "Empty collections",
      icon: faTrashCan,
      action: async (items: Collection[]) => {
        modalState.append({
          modalType: "options",
          modalContent: {
            type: "error",
            title: "Empty collections?",
            description:
              "Are you sure you want to empty these collections? It will remove all the articles from them",
            options: async () => {
              await Promise.all(
                items.map((item) =>
                  updateItem(item._id, [], "collection", "none")
                )
              );
              await invalidateAll();
            },
          },
        });
        return false;
      },
      requireOwn: true,
    },
    {
      title: "Remove collections",
      icon: faXmark,
      action: async (items: Collection[]) => {
        modalState.append({
          modalType: "options",
          modalContent: {
            type: "error",
            title: "Remove collections?",
            description:
              "Are you sure you want to unsubscribe from these collections? It will remove them from your page, but they will still be available to others.",
            options: async () => {
              for (const item of items) {
                await modifySubscription(item, false, "none");
              }
              await invalidateAll();
            },
          },
        });
        return false;
      },
      requireOwn: false,
    },
  ];

  const createCollection = () =>
    createItem("New Collection", [], "collection", "invalidateAll");

  const createFeed = () => {
    const modalId = uuid();

    modalState.append({
      id: modalId,
      modalType: "search",
      modalContent: {
        searchText: "Create feed",
        searchAction: async (query: ArticleSearchQuery) => {
          await createItem(
            "New Feed",
            sanitizeQuery(query),
            "feed",
            "invalidateAll"
          );
          modalState.remove(modalId);
        },
      },
    });
  };

  onMount(() => invalidateAll());
</script>

<div
  class="
  p-6 sm:p-12
  flex flex-col gap-12
"
>
  <ItemList
    itemType="feed"
    title="Your Feeds"
    create={{ text: "Create Feed", action: createFeed }}
    items={feedItems}
    globalActions={feedActions}
  />
  <ItemList
    itemType="collection"
    title="Your Collections"
    create={{ text: "Create Collection", action: createCollection }}
    items={collectionItems}
    globalActions={collectionActions}
  />
</div>
