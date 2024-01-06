<script lang="ts">
  import { page } from "$app/stores";
  import { filterArticles } from "$lib/common/filter";

  import List from "$com/article-list/main.svelte";

  import type { ArticleBase } from "$shared/types/api";
  import type { ArticleListRender } from "$shared/types/internal";

  export let articles: ArticleBase[];
  export let search: string;
  export let showRead: boolean;
  export let listRenderMode: ArticleListRender;

  $: alreadyReadCollection = $page.data.alreadyRead;
  $: filteredArticles = filterArticles(
    articles,
    search,
    !showRead && alreadyReadCollection ? $alreadyReadCollection?.ids : []
  );
</script>

<main class="m-6 sm:m-12 mt-3 sm:mt-6 overflow-y-auto">
  <List
    articles={filteredArticles}
    tintReadArticles={true}
    layout={listRenderMode}
  />
</main>
