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
      currentTarget: EventTarget & HTMLLIElement;
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
      "collection",
      false
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
  {#each Object.values($userCollections) as collection}
    {#if collectionSearch.length == 0 || collection.name
        .toLowerCase()
        .includes(collectionSearch.toLowerCase())}
      <li
        id={collection._id}
        class="
        p-2
        w-full min-w-max
        flex items-center

        text-left
        rounded-md

        space-x-2

        cursor-pointer

        hover:bg-primary-500/10
        [&:hover>input]:bg-primary-500/20
        [&:hover>input:checked]:bg-primary-600/75
        [&:hover>label>p>span.opacity-0]:opacity-75
      "
        on:click={handleCheckbox}
        on:keydown={handleCheckbox}
      >
        <input
          type="checkbox"
          id="collection-{collection._id}"
          checked={collection.ids.includes(articleId)}
          class="w-4 checkbox"
        />

        <label
          on:click|stopPropagation
          on:keydown|stopPropagation
          for="collection-{collection._id}"
          class="
            cursor-pointer
            font-light dark:font-normal
            dark:text-white
            {showStats ? 'text-sm md:text-base' : 'text-xs md:text-sm'}
          "
          >{collection.name}
          {#if showStats}
            <p class="inline text-black/50 dark:text-white/50 text-xs">
              <span>
                | {collection.ids.length} articles
              </span>
              <span class="opacity-0 transition-opacity hidden md:inline">
                | {collection._id}
              </span>
            </p>
          {/if}
        </label>
      </li>
      <hr class="border-surface-500/25 last:hidden my-1" />
    {/if}
  {/each}
</ul>
