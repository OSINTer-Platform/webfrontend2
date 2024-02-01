<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import type { ArticleListRender } from "$shared/types/internal";

  import LargeShell from "./layouts/large/shell.svelte";
  import LargeArticle from "./layouts/large/article.svelte";

  import TitleShell from "./layouts/title/shell.svelte";
  import TitleArticle from "./layouts/title/article.svelte";

  import Loader from "./loader.svelte";

  import { page } from "$app/stores";
  import { onDestroy } from "svelte";
  import { listElementCount } from "$shared/state/state";

  export let articles: ArticleBase[] = [];
  export let layout: ArticleListRender = "large";
  export let tintReadArticles: boolean;
  export let showHighlights: boolean;
  export let listLenLimit = 200;

  let chunksVisible = 1;

  const layouts: {
    [articleListRender in ArticleListRender]: { shell: any; article: any };
  } = {
    large: { shell: LargeShell, article: LargeArticle },
    title: { shell: TitleShell, article: TitleArticle },
  };

  $: alreadyRead = $page.data.alreadyRead;

  let readArticles: string[];
  $: readArticles = $alreadyRead && tintReadArticles ? $alreadyRead.ids : [];

  $: limitedArticles =
    listLenLimit > 0
      ? articles.slice(0, listLenLimit * chunksVisible)
      : articles;

  $: showLoader = limitedArticles.length < articles.length;

  $: listElementCount.set(articles.length);

  onDestroy(() => listElementCount.set(0));
</script>

<svelte:component this={layouts[layout].shell}>
  {#each limitedArticles as article (article.id)}
    <svelte:component
      this={layouts[layout].article}
      {article}
      {readArticles}
      {showHighlights}
      articleList={articles}
    />
  {/each}
  {#if showLoader}
    <Loader bind:chunksVisible />
  {/if}
</svelte:component>
