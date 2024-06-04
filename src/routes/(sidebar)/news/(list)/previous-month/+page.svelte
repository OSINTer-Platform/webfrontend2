<script lang="ts">
  import type { PageData } from "./$types";

  import FilterShell from "$com/itemList/articles/filter.svelte";
  import Loader from "$com/loader.svelte";

  import { feedLocalSearch } from "$shared/state/state";

  export let data: PageData;

  $: articles = data.loadingArticles;
  $: month = data.selectedMonth;
</script>

{#await $articles}
  <Loader text={`Loading articles for ${$month.name}`} />
{:then articles}
  <FilterShell {articles} search={$feedLocalSearch} />
{/await}
