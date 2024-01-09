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

  import type { Collection } from "$shared/types/userItems";
  import type { Readable } from "svelte/store";

  export let articles: ArticleBase[] = [];
  export let layout: ArticleListRender = "large";
  export let tintReadArticles: boolean;
  export let listLenLimit = 200;

  let chunksVisible = 1;

  const layouts: {
    [articleListRender in ArticleListRender]: { shell: any; article: any };
  } = {
    large: { shell: LargeShell, article: LargeArticle },
    title: { shell: TitleShell, article: TitleArticle },
  };

  let alreadyRead: undefined | Readable<Collection>;
  $: alreadyRead = $page.data.alreadyRead;

  let readArticles: string[];
  $: readArticles = $alreadyRead && tintReadArticles ? $alreadyRead.ids : [];

  $: limitedArticles =
    listLenLimit > 0
      ? articles.slice(0, listLenLimit * chunksVisible)
      : articles;

  $: showLoader = limitedArticles.length < articles.length;

  $: $page.data?.listElementCount?.set?.(articles.length);

  onDestroy(() => $page.data?.listElementCount?.set?.(0));
</script>

<svelte:component this={layouts[layout].shell}>
  {#each limitedArticles as article (article.id)}
    <svelte:component
      this={layouts[layout].article}
      {article}
      {readArticles}
      articleList={articles}
    />
  {/each}
  {#if showLoader}
    <Loader bind:chunksVisible />
  {/if}
</svelte:component>
