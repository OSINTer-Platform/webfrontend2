<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import type { Collection } from "$shared/types/userItems";
  import type { Writable } from "svelte/store";

  import Fa from "svelte-fa";
  import CollectionList from "../../components/collectionList.svelte";

  import { faStar } from "@fortawesome/free-regular-svg-icons";
  import { faCircleNodes } from "@fortawesome/free-solid-svg-icons";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let userCollections: Writable<{ [key: string]: Collection }>;
  export let article: ArticleBase;
</script>

<aside
  on:click|preventDefault|stopPropagation
  on:keydown|preventDefault|stopPropagation
  class="
      absolute right-16 md:right-20 z-10
      hidden justify-center
      h-full px-2
      bg-surface-50 dark:bg-surface-500
    "
>
  {#if article.similar && article.similar.length > 0}
    <button
      on:click={() => dispatch("showSimilar", article.id)}
      class="btn px-2"
      title="Show similar articles"
    >
      <Fa
        icon={faCircleNodes}
        class="
          ml-auto my-auto
          text-lg md:text-xl
          text-black/50 dark:text-white/90
          hover:text-primary-500
          transition-colors
        "
      />
    </button>
  {/if}
  {#if Object.values($userCollections).length > 0}
    <CollectionList
      {userCollections}
      {article}
      class="top-8 right-0"
      btnClass="px-2 btn"
    >
      <Fa
        icon={faStar}
        class="
            ml-auto my-auto
            text-lg md:text-xl
            text-black/75 dark:text-white/90
            hover:text-primary-500
            transition-colors
          "
      />
    </CollectionList>
  {/if}
</aside>
