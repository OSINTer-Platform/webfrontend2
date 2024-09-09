<script lang="ts">
  import type { Writable } from "svelte/store";
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import type {
    CollectionSortBy,
    ItemSortBy,
    WebhookSortBy,
  } from "$lib/common/sort";

  import {
    collectionSortBy,
    feedSortBy,
    webhookSortBy,
  } from "$shared/state/state";
  import {
    faArrowDownAZ,
    faArrowDownWideShort,
    faList,
  } from "@fortawesome/free-solid-svg-icons";
  import { faClock, faNewspaper } from "@fortawesome/free-regular-svg-icons";

  import Fa from "svelte-fa";
  import List from "./list.svelte";

  type ItemType = "feed" | "collection" | "webhook";

  type Options<SortBy> = {
    value: SortBy;
    text: string;
    icon: IconDefinition;
  }[];

  export let itemType: ItemType;
  export let btnClass = "btn p-2 text-lg h-10 w-10";
  export let containerClass =
    "bg-surface-100 dark:bg-surface-800 border border-surface-400";

  const stores: { [key in ItemType]: Writable<string> } = {
    feed: feedSortBy,
    collection: collectionSortBy,
    webhook: webhookSortBy,
  };

  const options: {
    feed: Options<ItemSortBy>;
    collection: Options<CollectionSortBy>;
    webhook: Options<WebhookSortBy>;
  } = {
    feed: [
      {
        value: "name",
        text: "Name",
        icon: faArrowDownAZ,
      },
      {
        value: "creationTime",
        text: "Creation Time",
        icon: faClock,
      },
    ],
    collection: [
      {
        value: "name",
        text: "Name",
        icon: faArrowDownAZ,
      },
      {
        value: "creationTime",
        text: "Creation Time",
        icon: faClock,
      },
      {
        value: "articleCount",
        text: "Article count",
        icon: faNewspaper,
      },
    ],
    webhook: [
      {
        value: "name",
        text: "Name",
        icon: faArrowDownAZ,
      },
      {
        value: "creationTime",
        text: "Creation Time",
        icon: faClock,
      },
      {
        value: "attachedCount",
        text: "Attached count",
        icon: faList,
      },
    ],
  };
</script>

<div class="[&:focus-within>ul]:flex relative h-fit">
  <button class={btnClass}>
    <Fa icon={faArrowDownWideShort} />
  </button>

  <ul
    class="
      z-10 absolute right-0 top-[120%]
      hidden flex-col gap-1 p-2
      {containerClass}
    "
  >
    <List store={stores[itemType]} options={options[itemType]} />
  </ul>
</div>
