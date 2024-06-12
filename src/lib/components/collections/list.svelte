<script lang="ts">
  import Loader from "$com/loader.svelte";
  import Fa from "svelte-fa";

  import { createItem, updateItem } from "$lib/common/userItems";
  import {
    faArrowUpRightFromSquare,
    faPlus,
  } from "@fortawesome/free-solid-svg-icons";

  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";

  export let userCollections: Writable<{ [key: string]: Collection }>;
  export let articleId: string;
  export let containerClass = "";
  export let showStats = false;
  export let collectionSearch = "";

  let loadingNew = false;

  const handleCheckbox = async (e: any) => {
    const target: HTMLElement = e.target;
    if (target.tagName == "A" || target.parentElement?.tagName == "A") return;
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
      <li class="w-full">
        <button
          id={_id}
          on:click={handleCheckbox}
          class="
            w-full p-2 flex items-center cursor-pointer

            text-left font-light dark:font-normal
            {showStats ? 'text-sm md:text-base' : 'text-xs md:text-sm'}

            hover:bg-primary-500/10
            [&:hover>input]:bg-primary-500/20
            [&:hover>input:checked]:bg-primary-600/75
            [&:hover>div>p.opacity-0]:opacity-75
            [&:hover>a]:opacity-100
          "
        >
          <input
            type="checkbox"
            id="collection-{_id}"
            checked={ids.includes(articleId)}
            class="w-4 checkbox mr-2"
            on:click|preventDefault
          />
          <div
            class="
            min-w-0 grow
            flex flex-nowrap items-center
            text-black dark:text-white
          "
          >
            <p class="flex items-center shrink-1 min-w-0">
              <span
                class="shrink min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                >{name}</span
              >
              {#if showStats}
                <span
                  class="
                  opacity-50 text-xs
                  inline-flex shrink-0 pl-1
                "
                >
                  | {ids.length} articles</span
                >
              {/if}
            </p>
            {#if showStats}
              <p
                class="
                text-black/50 dark:text-white/50 text-xs
                opacity-0 transition-opacity hidden md:inline
                whitespace-nowrap overflow-hidden text-ellipsis
                pl-1 shrink min-w-0 basis-0 grow
              "
              >
                | {_id}
              </p>
            {/if}
          </div>
          {#if showStats}
            <a
              title="Go to collection"
              class="h-8 w-8 btn opacity-0"
              href="/feed/{_id}"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Fa icon={faArrowUpRightFromSquare} />
            </a>
          {/if}
        </button>
      </li>
      <hr
        class="border-surface-400/25 last:hidden {showStats ? 'my-2' : 'my-1'}"
      />
    {/if}
  {/each}
  {#if loadingNew}
    <li>
      <div class="flex justify-center h-12">
        <Loader rows={1} containerClass="!items-start" class="w-16 h-4" />
      </div>
      <hr class="border-surface-400/25 {showStats ? 'my-2' : 'my-1'}" />
    </li>
  {/if}
  {#if showStats}
    <li>
      <button
        class="
        w-full p-2 flex items-center gap-2
        opacity-50 hover:opacity-100
        hover:bg-primary-500/5
        transition-all duration-300
      "
        on:click={async () => {
          if (loadingNew) return;
          loadingNew = true;
          await createItem("New Collection", [], "collection", "invalidateAll");
          loadingNew = false;
        }}
      >
        <Fa icon={faPlus} />
        Create new collection
      </button>
    </li>
  {/if}
</ul>
