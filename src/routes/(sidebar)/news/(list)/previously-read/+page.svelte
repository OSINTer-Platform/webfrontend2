<script lang="ts">
  import { fullArticles } from "$state/storedArticles";
  import { feedLocalSearch } from "$state/state";

  import FilterShell from "$com/itemList/articles/filter.svelte";
</script>

<FilterShell
  articles={Object.values($fullArticles)}
  search={$feedLocalSearch}
  tintReadArticles={false}
  emptyMessage={{
    title: "Well, no previously viewed articles",
    description:
      "Navigate to the time controls in the left sidebar to start exploring the articles, and the ones you read on this devices will appear here",
  }}
/>
