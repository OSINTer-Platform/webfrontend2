<script lang="ts">
  import List from "./main.svelte";

  import { showRead } from "$state/state";
  import { filterArticles } from "$lib/common/filter";
  import { page } from "$app/stores";

  import type { ArticleBase } from "$shared/types/api";

  export let articles: ArticleBase[];
  export let search: string;

  let classes: string = "";
  export { classes as class };
  export let tintReadArticles: boolean = true;
  export let listLenLimit = 100;

  $: readArticleIds = $page.data.readArticleIds;
  $: readArticles = filterArticles(articles, "", $readArticleIds);

  $: filteredArticles =
    $showRead || !readArticleIds
      ? filterArticles(articles, search)
      : filterArticles(readArticles, search);

  export let emptyMessage: { title: string; description: string } | null = null;
</script>

<List
  articles={filteredArticles}
  {tintReadArticles}
  {emptyMessage}
  containerClass={classes}
  {listLenLimit}
>
  <svelte:fragment slot="top">
    <slot name="top" />
  </svelte:fragment>

  <svelte:fragment slot="bottom">
    <slot name="bottom" />
  </svelte:fragment>
</List>
