<script lang="ts">
  import FilterShell from "$com/itemList/articles/filter.svelte";
  import { feedLocalSearch } from "$shared/state/state";

  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<FilterShell articles={data.articles} search={$feedLocalSearch} />
