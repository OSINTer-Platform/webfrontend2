<script lang="ts">
  import type { PageData } from "./$types";
  import List from "$com/article-list/wrapper.svelte";

  import { feedLocalSearch } from "$state/state";
  import { filterArticles } from "$lib/common/filter";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import Loader from "$com/loader.svelte";

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
  <List articles={filterArticles(articles, $feedLocalSearch)} />
{/await}
