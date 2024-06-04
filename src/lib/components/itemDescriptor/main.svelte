<script lang="ts">
  import type { Feed, Collection } from "$shared/types/userItems";
  import type { ArticleCategories } from "$shared/types/api";

  import FeedRender from "./feed.svelte";
  import CollectionRender from "./collection.svelte";

  export let currentItem: Feed | Collection;
  export let categories: ArticleCategories;

  function isFeed(item: Feed | Collection): item is Feed {
    return item.type == "feed";
  }
</script>

<section class="my-6">
  {#if isFeed(currentItem)}
    <FeedRender {currentItem} {categories} />
  {:else}
    <CollectionRender {currentItem} />
  {/if}
</section>
