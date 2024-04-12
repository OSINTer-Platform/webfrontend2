<script lang="ts">
  import type { PageData } from "./$types";

  import FilterShell from "$com/article-list/filter.svelte";
  import Loader from "$com/loader.svelte";

  import { feedLocalSearch } from "$shared/state/state";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  export let data: PageData;
  const articles = data.articles;
  const month = data.currentMonth;

  onMount(async () => {
    if (browser) {
      data.currentMonth.subscribe(async (monthId) => {
        const currentMonth = data.monthLookup[monthId];
        articles.set(data.fetchArticles(currentMonth.url));
      });
    }
  });
</script>

{#await $articles}
  <Loader text={`Loading articles for ${data.monthLookup[$month].name}`} />
{:then articles}
  <FilterShell {articles} search={$feedLocalSearch} />
{/await}
