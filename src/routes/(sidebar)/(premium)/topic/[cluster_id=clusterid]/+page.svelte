<script lang="ts">
  import List from "$com/article-list/wrapper.svelte";

  import type { PageData } from "./$types";

  import { articleSearch } from "$shared/state/topics";
  import { searchInArticle } from "$lib/common/filter";

  export let data: PageData;

  $: filteredArticles =
    $articleSearch.length > 0
      ? data.articles.filter((article) =>
          searchInArticle(article, $articleSearch)
        )
      : data.articles;
</script>

<List articles={filteredArticles} tintReadArticles={true} />
