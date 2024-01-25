<script lang="ts">
  import { updateItem } from "$lib/common/userItems";
  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";

  export let userCollections: Writable<{ [key: string]: Collection }>;
  export let articleId: string;
  export let containerClass = "";
  export let showStats = false;
  export let collectionSearch = "";

  const handleCheckbox = async (
    e: (MouseEvent | KeyboardEvent) & {
      currentTarget: EventTarget & HTMLLabelElement;
    }
  ) => {
    const collectionId = e.currentTarget.id;
    const collection = $userCollections[collectionId];

    let contents: string[] = collection.ids;
    if (collection.ids.includes(articleId)) {
      contents = contents.filter((v) => v != articleId);
    } else {
      contents.push(articleId);
    }

    const newCollection = await updateItem(
      collectionId,
      contents,
      "collection"
    );

    if (newCollection) {
      userCollections.update((collections) => {
        collections[collectionId] = newCollection;
        return collections;
      });
    }
  };
</script>

<ul class={containerClass}>
  {#each Object.values($userCollections) as { _id, ids, name }}
    {#if collectionSearch.length == 0 || name
        .toLowerCase()
        .includes(collectionSearch.toLowerCase())}
      <li
        class="
        w-full min-w-max
      "
      >
        <label
          id={_id}
          on:click|stopPropagation|preventDefault={handleCheckbox}
          on:keydown|stopPropagation|preventDefault={handleCheckbox}
          for="collection-{_id}"
          class="
            p-2
            flex items-center

            cursor-pointer rounded-md

            text-left font-light dark:font-normal dark:text-white
            {showStats ? 'text-sm md:text-base' : 'text-xs md:text-sm'}

            hover:bg-primary-500/10
            [&:hover>input]:bg-primary-500/20
            [&:hover>input:checked]:bg-primary-600/75
            [&:hover>p>span.opacity-0]:opacity-75
          "
        >
          <input
            type="checkbox"
            id="collection-{_id}"
            checked={ids.includes(articleId)}
            class="w-4 checkbox mr-2"
          />
          {name}
          {#if showStats}
            <p class="pl-1 inline text-black/50 dark:text-white/50 text-xs">
              <span>
                | {ids.length} articles
              </span>
              <span class="opacity-0 transition-opacity hidden md:inline">
                | {_id}
              </span>
            </p>
          {/if}
        </label>
      </li>
      <hr
        class="border-surface-400/25 last:hidden {showStats ? 'my-2' : 'my-1'}"
      />
    {/if}
  {/each}
</ul>
