<script lang="ts">
  import Modal from "./modal.svelte";
  import SearchFields from "$com/search/main.svelte";

  import type { ArticleSearchQuery } from "$shared/types/api";

  import { getStandardSearch } from "$shared/config";

  export let searchQuery: ArticleSearchQuery = getStandardSearch();
  export let callback: null | ((q: ArticleSearchQuery) => void) = null;
  export let searchText: string = "Search Content";
</script>

<Modal
  class="
	max-w-[90rem] w-[95vw] h-[90vh]
	bg-surface-100 dark:bg-surface-800
	@container/full
"
>
  <SearchFields
    bind:searchQuery
    submitText={searchText}
    on:submit={(e) => {
      if (callback) {
        e.preventDefault();
        callback(searchQuery);
      }
    }}
  />
</Modal>
