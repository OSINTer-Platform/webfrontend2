<script lang="ts">
  import Article from "./article.svelte";

  import type { ArticleBase } from "$shared/types/api";

  export let articleListContainer: HTMLDivElement | null;
  export let articles: ArticleBase[];
</script>

<div
  role="feed"
  on:mouseenter
  on:mouseleave
  bind:this={articleListContainer}
  class="
    flex flex-col shrink-0
    w-full h-full

    overflow-y-auto
    scrollbar-hover
    "
>
  {#each articles as article (article.id)}
    <Article {article} articleList={articles} />

    <hr class="border border-surface-400/25 my-3" />
  {/each}
</div>
