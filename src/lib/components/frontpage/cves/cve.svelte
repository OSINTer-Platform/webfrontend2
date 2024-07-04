<script lang="ts">
  import DetailList from "$com/itemList/header/detailList.svelte";
  import ArticleListElement from "$com/itemList/articles/layouts/large/article.svelte";

  import { getReadableDate } from "$lib/common/math";
  import { createSearchFromTag } from "$lib/common/searchQuery";

  import type { CVEBase } from "$shared/types/api";
  import { queryArticles, queryArticlesById } from "$lib/common/queryArticles";
  import Loader from "$com/loader.svelte";

  export let cve: CVEBase;

  $: cveBaseScore =
    cve.cvss3?.cvss_data.base_score ?? cve.cvss2?.cvss_data.base_score;

  $: cveDetails = [
    [
      {
        title: "BaseScore",
        content: cveBaseScore?.toString() ?? "Unknown",
        mono: false,
      },
      { title: "CVE", content: [cve.cve], mono: false },
      { title: "Weaknesses", content: cve.weaknesses, mono: false },
      {
        title: "Keywords",
        content: cve.keywords.slice(0, 5).map((w) => ({
          content: w,
          href: createSearchFromTag(w),
        })),
        mono: true,
      },
    ],
  ];

  $: articles = queryArticles(
    {
      limit: 10000,
      search_term: `"${cve.cve}"`,
      sort_by: "",
      sort_order: "desc",
      highlight: true,
    },
    false
  );
</script>

<main class="flex flex-col overflow-auto">
  <header class="p-6">
    <h3 class="text-2xl md:text-4xl font-bold mb-2">
      {cve.cve}: {cve.title}
    </h3>
    <p class="font-light text-sm mb-4">{cve.description}</p>
    <DetailList detailBatches={cveDetails} />
  </header>
  <section class="px-3">
    {#await articles}
      <Loader text="Loading CVE articles" />
    {:then { documents }}
      {#if documents}
        {#each documents as article}
          <ArticleListElement
            {article}
            articleList={documents}
            showHighlights={true}
            readArticles={[]}
          />
        {/each}
      {/if}
    {/await}
  </section>
</main>
