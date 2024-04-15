<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import type { ArticleListRender } from "$shared/types/internal";

  import LargeShell from "./layouts/large/shell.svelte";
  import LargeArticle from "./layouts/large/article.svelte";

  import TitleShell from "./layouts/title/shell.svelte";
  import TitleArticle from "./layouts/title/article.svelte";

  import Loader from "../loader.svelte";
  import Wrapper from "../wrapper.svelte";

  import { page } from "$app/stores";
  import { onDestroy, type ComponentType, SvelteComponent } from "svelte";
  import { listElementCount, showHighlights } from "$shared/state/state";

  export let articles: ArticleBase[] = [];
  export let layout: ArticleListRender | undefined = undefined;
  export let tintReadArticles: boolean;
  export let listLenLimit = 100;
  export let emptyMessage: { title: string; description: string } | null = null;
  export let containerClass: string = "";

  let chunksVisible = 1;

  const layouts: {
    [articleListRender in ArticleListRender]: {
      shell: ComponentType<SvelteComponent>;
      article: ComponentType<
        SvelteComponent<{
          article: ArticleBase;
          articleList: ArticleBase[];
          readArticles: string[];
          showHighlights: boolean;
        }>
      >;
    };
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

  $: renderSetting = $page.data.settings.listRenderMode;
  $: renderLayout = layout ?? $renderSetting;

  onDestroy(() => listElementCount.set(0));
</script>

<Wrapper empty={articles.length < 1} {emptyMessage} class={containerClass}>
  <slot name="top" />
  <svelte:component this={layouts[renderLayout].shell}>
    {#each limitedArticles as article (article.id)}
      <svelte:component
        this={layouts[renderLayout].article}
        {article}
        {readArticles}
        showHighlights={$showHighlights}
        articleList={articles}
      />
    {/each}
    {#if showLoader}
      <Loader bind:chunksVisible />
    {/if}
  </svelte:component>
  <slot name="bottom" />
</Wrapper>
