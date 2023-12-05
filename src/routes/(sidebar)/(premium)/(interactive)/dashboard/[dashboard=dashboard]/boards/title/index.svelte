<script lang="ts">
  import { page } from "$app/stores";

  import Article from "./article.svelte";

  import type { ArticleBase } from "$shared/types/api";
  import type { Collection } from "$shared/types/userItems";
  import type { Readable } from "svelte/store";

  export let articleListContainer: HTMLDivElement | null;
  export let articleList: ArticleBase[];

  let alreadyRead: undefined | Readable<Collection>;
  $: alreadyRead = $page.data.alreadyRead;

  let readArticles: string[];
  $: readArticles = $alreadyRead ? $alreadyRead.ids : [];
</script>

<div
  on:mouseenter
  on:mouseleave
  bind:this={articleListContainer}
  class="
    flex flex-col shrink-0
    w-full h-full pr-8
    border-r border-tertiary-500 dark:border-surface-400

    overflow-y-auto
    "
>
  {#each articleList as article}
    <Article
      {article}
      {readArticles}
      {articleList}
      userCollections={$page.data.userCollections}
    />
  {/each}
</div>
