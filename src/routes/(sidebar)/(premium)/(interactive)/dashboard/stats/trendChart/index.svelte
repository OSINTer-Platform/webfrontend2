<script lang="ts">
  import { browser } from "$app/environment";
  import { searchArticles } from "$lib/common/elasticsearch/search";
  import { onMount } from "svelte";

  import type { Trend } from "./common";
  import type { FullArticle } from "$shared/types/api";

  import Linechart from "./linechart.svelte";
  import Loader from "$com/loader.svelte";
  import type { Writable } from "svelte/store";

  export let startDate: Date;
  export let endDate: Date;

  export let keywords: Writable<string[]>;
  let mounted = false;

  $: trends = updateTrends($keywords, startDate, endDate, mounted);

  const getArticles = async (
    keyword: string,
    startDate: Date,
    endDate: Date
  ): Promise<[string, Pick<FullArticle, "id" | "publish_date">[]]> => [
    keyword,
    await searchArticles(
      {
        limit: 0,
        first_date: startDate.toISOString(),
        last_date: endDate.toISOString(),
        search_term: `"${keyword}"`,
        sort_order: "asc",
        sort_by: "publish_date",
      },
      { include_fields: ["publish_date"] }
    ),
  ];

  async function updateTrends(
    keywords: string[],
    startDate: Date,
    endDate: Date,
    mounted: boolean
  ): Promise<Trend[]> {
    if (!mounted) return [];

    const findCached = (keyword: string, cache: Trend[]) =>
      cache.find(
        (t) =>
          t.name === keyword &&
          t.startDate === startDate &&
          t.endDate === endDate
      );

    const cached = await trends;

    const queries = keywords
      .filter((w) => findCached(w, cached) === undefined)
      .map((w) => getArticles(w, startDate, endDate));

    const results = await Promise.all(queries);
    const cachedResults = keywords
      .map((w) => findCached(w, cached))
      .filter((c): c is Trend => c !== undefined);

    return [
      ...cachedResults,
      ...results.map(([keyword, articles]) => ({
        name: keyword,
        startDate,
        endDate,
        trend: articles.map((a) => new Date(a.publish_date)),
      })),
    ];
  }

  onMount(async () => {
    if (!browser) return;
    mounted = true;
  });
</script>

{#await trends}
  <Loader text="Loading stats" />
{:then trends}
  <Linechart {trends} {startDate} {endDate} {keywords} />
{/await}
