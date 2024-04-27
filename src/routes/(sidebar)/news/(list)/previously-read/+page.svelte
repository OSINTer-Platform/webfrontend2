<script lang="ts">
  import { feedLocalSearch } from "$state/state";

  import type { PageData } from "./$types";

  import FilterShell from "$com/itemList/articles/filter.svelte";
  import Loader from "$com/loader.svelte";

  export let data: PageData;

  $: loadingArticles = data.loadingArticles;
  $: user = data.user;
</script>

{#await $loadingArticles}
  <Loader text="Loading articles..." />
{:then articles}
  <FilterShell
    {articles}
    search={$feedLocalSearch}
    tintReadArticles={false}
    emptyMessage={{
      title: "Well, no previously viewed articles",
      description: `Navigate to the time controls in the left sidebar to start exploring the articles, and the ones you read on this ${
        $user ? "user" : "device"
      } will appear here`,
    }}
  />
{/await}
