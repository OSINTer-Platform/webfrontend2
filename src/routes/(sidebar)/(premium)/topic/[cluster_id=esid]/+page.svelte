<script lang="ts">
  import FilterShell from "$com/article-list/filter.svelte";

  import type { PageData } from "./$types";

  import { articleSearch } from "$shared/state/topics";

  export let data: PageData;
</script>

<FilterShell articles={data.articles} search={$articleSearch} />
