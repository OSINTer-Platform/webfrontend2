<script lang="ts">
  import SearchFields from "$com/search/main.svelte";
  import type { PageData } from "./$types";

  import type { SearchQuery } from "$shared/types/api";
  export let data: PageData;

  export let searchQuery: SearchQuery;
</script>

<SearchFields sourceCategories={data.sourceCategories} bind:searchQuery />
