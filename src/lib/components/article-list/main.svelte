<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import type { ArticleListRender } from "$shared/types/internal";

  import LargeShell from "./layouts/large/shell.svelte";
  import LargeArticle from "./layouts/large/article.svelte";

  import TitleShell from "./layouts/title/shell.svelte";
  import TitleArticle from "./layouts/title/article.svelte";

  import { page } from "$app/stores";
  import type { Collection } from "$shared/types/userItems";
  import type { Readable } from "svelte/store";

  export let articles: ArticleBase[] = [];
  export let layout: ArticleListRender = "large";
  export let tintReadArticles: boolean;

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
</script>

<svelte:component this={layouts[layout].shell}>
  {#each articles as article}
    <svelte:component
      this={layouts[layout].article}
      {article}
      {readArticles}
      articleList={articles}
      userCollections={$page.data.userCollections}
    />
  {/each}
</svelte:component>
