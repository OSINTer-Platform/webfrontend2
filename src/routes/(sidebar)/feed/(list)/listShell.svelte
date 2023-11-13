<script lang="ts">
  import List from "$com/article-list/wrapper.svelte";

  import { feedLocalSearch, showRead } from "$state/state";
  import { filterArticles } from "$lib/common/filter";
  import { page } from "$app/stores";

  import type { ArticleBase } from "$shared/types/api";

  export let articles: ArticleBase[];
  $: alreadyReadCollection = $page.data.alreadyRead;
  $: alreadyRead = filterArticles(articles, "", $alreadyReadCollection?.ids);

  $: filteredArticles =
    $showRead && alreadyReadCollection
      ? filterArticles(articles, $feedLocalSearch)
      : filterArticles(alreadyRead, $feedLocalSearch);

  export let emptyMessage: { title: string; description: string } | null = null;
</script>

<List articles={filteredArticles} tintReadArticles={true} {emptyMessage} />
