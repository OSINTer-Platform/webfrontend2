<script lang="ts">
  import { page } from "$app/stores";

  import Article from "./article.svelte";

  import type { ArticleBase } from "$shared/types/api";

  export let articleListContainer: HTMLDivElement | null;
  export let articles: ArticleBase[];

  $: readArticleIds = $page.data.readArticleIds;
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
    "
>
  {#each articles as article (article.id)}
    <Article {article} readArticles={$readArticleIds} articleList={articles} />

    <hr class="border border-surface-400/25 my-3" />
  {/each}
</div>
