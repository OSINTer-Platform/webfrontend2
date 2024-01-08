<script lang="ts">
  import ArticleList from "$com/article-list/main.svelte";
  import Stats from "./stats.svelte";

  import type { ArticleBase } from "$shared/types/api";

  export let articleListContainer: HTMLDivElement | null;
  export let articles: ArticleBase[];
</script>

<div
  on:mouseenter
  on:mouseleave
  bind:this={articleListContainer}
  class="
    flex flex-col shrink-0
    w-3/5 h-full pr-8
    border-r border-tertiary-500 dark:border-surface-400

    overflow-y-auto
    "
>
  <ArticleList
    tintReadArticles={false}
    {articles}
    layout="large"
    listLenLimit={0}
  />
</div>

<div
  class="
    flex flex-col gap-6
    w-2/5 h-full pl-8
  "
>
  <Stats {articles} />
</div>
