<script lang="ts">
  import FilterShell from "$com/article-list/filter.svelte";
  import { feedLocalSearch } from "$shared/state/state";

  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<FilterShell articles={data.articles} search={$feedLocalSearch} />
