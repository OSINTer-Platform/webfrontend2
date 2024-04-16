<script lang="ts">
  import ArticleList from "$com/itemList/articles/filter.svelte";

  import { articleSearch } from "$shared/state/cves";

  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<ArticleList
  articles={data.articles}
  search={$articleSearch}
  emptyMessage={{
    title: "No articles for CVE",
    description:
      "OSINTer has not registered any news article related to this CVE",
  }}
/>
