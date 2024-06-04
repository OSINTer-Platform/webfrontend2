<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import Filter from "$com/itemList/articles/filter.svelte";

  export let articles: ArticleBase[];
  export let search: string;
</script>

<main class="overflow-y-auto">
  <Filter {articles} {search} />
</main>
