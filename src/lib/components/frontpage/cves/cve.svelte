<script lang="ts">
  import DetailList from "$com/itemList/header/detailList.svelte";
  import ArticleListElement from "$com/itemList/articles/layouts/large/article.svelte";
  import ListLimiter from "$com/itemList/limiter.svelte";
  import Loader from "$com/loader.svelte";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import { createSearchFromTag } from "$lib/common/searchQuery";
  import { onMount } from "svelte";

  import type { ArticleBase, CVEBase } from "$shared/types/api";

  export let cve: CVEBase;

  let mounted = false;

  async function getArticles(
    cve: string,
    mounted: boolean
  ): Promise<ArticleBase[]> {
    if (!mounted) return Promise.resolve([] as ArticleBase[]);

    const r = await fetch(`${PUBLIC_API_BASE}/frontpage/cve-articles/${cve}`);
    if (r.ok) {
      return await r.json();
    } else {
      throw (await r.json())["detail"];
    }
  }

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
    {:catch err}
      <div
        class="w-full h-full flex flex-col justify-center items-center text-center mb-4"
      >
        <h4 class="text-2xl sm:text-4xl font-bold">
          Error when querying articles
        </h4>
        <p>{err}</p>
      </div>
    {/await}
  </section>
</main>
