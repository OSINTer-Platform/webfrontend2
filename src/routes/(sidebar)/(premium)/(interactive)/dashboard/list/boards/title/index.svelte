<script lang="ts">
  import { page } from "$app/stores";

  import Article from "./article.svelte";

  import type { ArticleBase } from "$shared/types/api";

  export let articleListContainer: HTMLDivElement | null;
  export let articles: ArticleBase[];

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
    w-full h-full

    overflow-y-auto
    "
>
  {#each articles as article (article.id)}
    <Article {article} {readArticles} articleList={articles} />
  {/each}
</div>
