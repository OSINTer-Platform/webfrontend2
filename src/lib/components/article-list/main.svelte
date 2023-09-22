<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import type { ArticleListRender } from "$shared/types/internal";

  import LargeShell from "./layouts/large/shell.svelte";
  import LargeArticle from "./layouts/large/article.svelte";

  import TitleShell from "./layouts/title/shell.svelte";
  import TitleArticle from "./layouts/title/article.svelte";

  import { page } from "$app/stores";

  export let articles: ArticleBase[] = [];
  export let layout: ArticleListRender = "large";

  const layouts: {
    [articleListRender in ArticleListRender]: { shell: any; article: any };
  } = {
    large: { shell: LargeShell, article: LargeArticle },
    title: { shell: TitleShell, article: TitleArticle },
  };

  $: alreadyRead = $page.data.alreadyRead;
</script>

<svelte:component this={layouts[layout].shell}>
  {#each articles as article}
    {@const read =
      $page.url.pathname.startsWith("/feed") &&
      $alreadyRead?.ids.includes(article.id)}
    <svelte:component
      this={layouts[layout].article}
      {article}
      {read}
      articleList={articles}
      userCollections={$page.data.userCollections}
    />
  {/each}
</svelte:component>
