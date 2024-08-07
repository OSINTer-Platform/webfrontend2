<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import type { ArticleListRender } from "$shared/types/internal";
  import type { ComponentType, SvelteComponent } from "svelte";

  import LargeShell from "./layouts/large/shell.svelte";
  import LargeArticle from "./layouts/large/article.svelte";

  import TitleShell from "./layouts/title/shell.svelte";
  import TitleArticle from "./layouts/title/article.svelte";

  import Limiter from "../limiter.svelte";
  import Wrapper from "../wrapper.svelte";

  import { page } from "$app/stores";
  import { showHighlights } from "$shared/state/state";

  export let articles: ArticleBase[] = [];
  $: articles = articles ?? [];
  // See https://github.com/sveltejs/svelte/issues/11647

  export let layout: ArticleListRender | undefined = undefined;
  export let tintReadArticles: boolean;
  export let listLenLimit = 100;
  export let emptyMessage: { title: string; description: string } | null = null;
  export let containerClass: string = "";

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

  $: readArticleIds = $page.data.readArticleIds;

  let readArticles: string[];
  $: readArticles = $readArticleIds && tintReadArticles ? $readArticleIds : [];

  $: renderSetting = $page.data.settings.listRenderMode;
  $: renderLayout = layout ?? $renderSetting;
</script>

<Wrapper empty={articles.length < 1} {emptyMessage} class={containerClass}>
  <svelte:component this={layouts[renderLayout].shell}>
    <Limiter list={articles} {listLenLimit} let:listElement>
      <slot name="top" />

      <svelte:component
        this={layouts[renderLayout].article}
        article={listElement}
        {readArticles}
        showHighlights={$showHighlights}
        articleList={articles}
      />

      <slot name="bottom" />
    </Limiter>
  </svelte:component>
</Wrapper>
