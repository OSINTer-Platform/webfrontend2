<script lang="ts">
  import SearchFields from "$com/search/main.svelte";
  import type { PageData } from "./$types";

  import type { SearchQuery } from "$shared/types/api";
  export let data: PageData;

  export let searchQuery: SearchQuery;
</script>

<form action="/feed/search" method="get" class="h-full">
  <SearchFields sourceCategories={data.sourceCategories} bind:searchQuery>
    <svelte:fragment slot="main-button">
      <button
        class="grow btn
			">Search Content</button
      >
    </svelte:fragment>
  </SearchFields>
</form>
