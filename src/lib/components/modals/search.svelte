<script lang="ts">
  import Modal from "./modal.svelte";
  import SearchFields from "$com/search/main.svelte";

  import type { SearchQuery } from "$shared/types/api";

  import { getStandardSearch } from "$shared/config";

  export let searchQuery: SearchQuery = getStandardSearch();
  export let callback: null | ((q: SearchQuery) => void) = null;
  export let searchText: string = "Search Content";
</script>

<Modal
  class="
	w-[80vw] h-[90vh]
	bg-surface-100 dark:bg-surface-800
	@container/full
"
>
  <form action="/feed/search" method="get" class="h-full">
    <SearchFields bind:searchQuery>
      <svelte:fragment slot="main-button">
        <button
          type={callback ? "button" : null}
          class="grow btn"
          on:click={() => {
            if (callback) callback(searchQuery);
          }}>{searchText}</button
        >
      </svelte:fragment>
    </SearchFields>
  </form>
</Modal>
