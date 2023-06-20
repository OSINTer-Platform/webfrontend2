<script lang="ts">
  import type { PageData } from "./$types";
  import List from "$com/article-list/wrapper.svelte";

  import { feedLocalSearch } from "$state/state";
  import { filterArticles } from "$lib/common/filter";

  export let data: PageData;
</script>

<List articles={filterArticles(data.articles, $feedLocalSearch)} />
