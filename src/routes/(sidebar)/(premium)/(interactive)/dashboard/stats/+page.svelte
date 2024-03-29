<script lang="ts">
  import type { PageData } from "./$types";
  import type {
    SignificantTermAgg,
    TermAgg,
  } from "$lib/common/elasticsearch/aggregations";
  import type { ClusterBase } from "$shared/types/api";

  import * as d3 from "d3";

  import Controls from "../controls/shell.svelte";
  import Upper from "./upper.svelte";
  import Lower from "./lower.svelte";
  import { modalState } from "$shared/state/modals";
  import { getBaseArticles } from "$lib/common/elasticsearch/search";
  import { spawnArticleModal } from "$lib/common/state";
  import { page } from "$app/stores";

  $: renderExternal = $page.data.settings.renderExternal;

  export let data: PageData;

  const convertTermAggs = (agg: TermAgg | SignificantTermAgg) => {
    const getScore = (bucket: { score?: number; doc_count: number }) =>
      bucket.score ?? bucket.doc_count;

    const max = d3.max(agg.buckets, (b) => getScore(b)) ?? 0;
    const scale = d3.scaleLinear([0, max], [0, 1]);

    const getDescription = (bucket: { doc_count: number; bg_count?: number }) =>
      bucket.bg_count
        ? `${bucket.doc_count}/${bucket.bg_count} occurrences`
        : `${bucket.doc_count} occurrences`;

    return agg.buckets.map((bucket) => ({
      title: bucket.key,
      description: getDescription(bucket),
      score: scale(getScore(bucket)),
      large: false,
      href: `/feed/search?sort_by=publish_date&highlight=true&search_term=${encodeURIComponent(
        `"${bucket.key}"`
      )}`,
      action: () => {
        modalState.append({
          modalType: "article-list",
          modalContent: {
            articles: getBaseArticles({
              limit: 0,
              highlight: true,
              sort_by: "publish_date",
              sort_order: "desc",
              search_term: `"${bucket.key}"`,
            }),
          },
        });
      },
    }));
  };

  const convertClusters = (
    items: { title: string; description: string; score: number }[]
  ) =>
    items
      .map((item): [typeof item, ClusterBase | undefined] => [
        item,
        data.clusters.find((c) => c.id == item.title),
      ])
      .map(([{ title, description, score }, cluster]) => ({
        large: true,
        title: cluster?.title ?? title,
        href: `/topic/${title}`,
        action: () => {
          modalState.append({
            modalType: "article-list",
            modalContent: {
              articles: getBaseArticles({
                limit: 0,
                sort_by: "publish_date",
                sort_order: "desc",
                cluster_id: title,
              }),
            },
          });
        },
        description,
        score,
      }));

  const convertArticles = (
    articles: { title: string; id: string; read_times: number; url: string }[],
    external: boolean
  ) => {
    const max = d3.max(articles, (a) => a.read_times) ?? 0;
    const scale = d3.scaleLinear([0, max], [0, 1]);

    return articles.map(({ title, id, read_times, url }) => ({
      title: title,
      description: `${read_times} reads`,
      large: false,
      score: scale(read_times),
      href: `/article/${id}`,
      action: external
        ? () => window.open(url, "_blank")
        : () => spawnArticleModal(id, articles),
    }));
  };

  $: upperList = [
    {
      title: "Emerging Tags",
      items: convertTermAggs(data.metrics.limited.new_tags),
    },
    {
      title: "Common CVE's",
      items: convertTermAggs(data.metrics.limited.cves),
    },
    {
      title: "Emerging topics",
      items: convertClusters(convertTermAggs(data.metrics.limited.clusters)),
    },
    {
      title: "Most Read Articles",
      items: convertArticles(data.metrics.articles, $renderExternal),
    },
  ];
</script>

<main
  class="
  relative
  grid grid-cols-1 grid-rows-2
  h-full w-full px-10 py-8
  bg-surface-100 dark:bg-surface-800
"
>
  <section
    class="
    grow pb-4
    grid grid-cols-4
    divide-surface-300/25 divide-x-2
    border-b-2 border-surface-300/50
  "
  >
    <Upper lists={upperList} />
  </section>
  <section
    class="
    grow pt-4
    grid grid-cols-2 grid-rows-1
    divide-surface-300/25 divide-x-2
  "
  >
    <Lower
      startDate={data.startDate}
      significantTags={data.metrics.limited.new_tags}
      cves={data.metrics.limited.cves}
      globalTags={data.metrics.global.tags}
    />
  </section>

  <Controls startDate={data.startDate} />
</main>
