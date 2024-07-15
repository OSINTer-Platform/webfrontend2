<script lang="ts">
  import DetailList from "$com/itemList/header/detailList.svelte";
  import ArticleListElement from "$com/itemList/articles/layouts/large/article.svelte";
  import ListLimiter from "$com/itemList/limiter.svelte";
  import Loader from "$com/loader.svelte";

  import { createSearchFromTag } from "$lib/common/searchQuery";
  import { queryArticles } from "$lib/common/queryArticles";
  import { onMount } from "svelte";

  import type { ArticleBase, CVEBase } from "$shared/types/api";

  export let cve: CVEBase;

  let mounted = false;

  const getArticles = (cve: string, mounted: boolean) =>
    mounted
      ? queryArticles(
          {
            limit: 10000,
            search_term: `"${cve}"`,
            sort_by: "",
            sort_order: "desc",
            highlight: true,
          },
          false
        ).then(({ documents }) => documents ?? [])
      : Promise.resolve([] as ArticleBase[]);

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

  $: articles = getArticles(cve.cve, mounted);

  onMount(() => (mounted = true));
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
    {:then articles}
      <ListLimiter
        list={articles}
        listLenLimit={30}
        let:listElement={article}
        updateCount={false}
      >
        <ArticleListElement
          {article}
          articleList={articles}
          showHighlights={true}
          readArticles={[]}
        />
      </ListLimiter>
    {/await}
  </section>
</main>
