<script lang="ts">
  import FilterShell from "$com/article-list/filter.svelte";
  import { feedLocalSearch } from "$shared/state/state";

  import type { PageData } from "./$types";
  export let data: PageData;

  const emptyMessage = {
    title: "This search is empty",
    description:
      "Try changing paramaters like search terms or date range to include more articles",
  };
</script>

<FilterShell
  articles={data.articles}
  {emptyMessage}
  search={$feedLocalSearch}
/>
