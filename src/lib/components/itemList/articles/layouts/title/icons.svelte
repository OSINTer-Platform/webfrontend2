<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";

  import Fa from "svelte-fa";
  import CollectionButton from "$com/collections/button.svelte";

  import { faCircleNodes } from "@fortawesome/free-solid-svg-icons";

  import { createEventDispatcher } from "svelte";
  import { page } from "$app/stores";
  const dispatch = createEventDispatcher();

  export let article: ArticleBase;

  $: userCollections = $page.data.userCollections;
</script>

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
      text-black/75 dark:text-white/90
      hover:text-primary-500
      transition-colors
    "
    />
  </button>
{/if}
<CollectionButton
  {article}
  {userCollections}
  iconClass="text-xl"
  btnClass="btn aspect-square h-full"
  overlayClass="top-10 right-0"
/>
