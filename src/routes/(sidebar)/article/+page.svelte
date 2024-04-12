<script lang="ts">
  import type { HeaderModOptions } from "$shared/types/internal";

  import HeaderShell from "$com/article-list/header/shell.svelte";
  import List from "$com/article-list/wrapper.svelte";

  import {
    filteredArticles,
    fullArticles,
    localSearch,
  } from "$state/storedArticles";
  import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

  const modOptions: Array<HeaderModOptions> = [
    {
      title: "Clear stored",
      icon: faTrashCan,
      action: () => fullArticles.set({}),
    },
  ];
</script>

<HeaderShell
  title={"Recently viewed articles"}
  description={"A list of the articles you have recently viewed in OSINTer"}
  searchAble={false}
  {modOptions}
  articles={$filteredArticles}
  bind:searchValue={$localSearch}
/>

<List
  articles={$filteredArticles}
  tintReadArticles={false}
  showHighlights={false}
  emptyMessage={{
    title: "Well, no recently viewed articles",
    description:
      "Navigate to the feed section to start exploring the articles, and the ones you read on this devices will appear here",
  }}
/>
