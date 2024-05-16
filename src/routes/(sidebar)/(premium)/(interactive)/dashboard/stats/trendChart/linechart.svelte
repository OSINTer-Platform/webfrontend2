<script lang="ts">
  import * as d3 from "d3";

  import Linechart from "$com/charts/linechart/index.svelte";
  import TagLine from "../tagline.svelte";

  import type { Trend } from "./common";
  import type { Writable } from "svelte/store";
  import { modalState } from "$shared/state/modals";
  import { getBaseArticles } from "$lib/common/elasticsearch/search";

  export let trends: Trend[];
  export let startDate: Date;
  export let endDate: Date;
  export let keywords: Writable<string[]>;

  let hoverText = "";

  let xDomain: [number, number];
  $: xDomain = [startDate.getTime(), endDate.getTime()];

  $: customXAxisScale = d3.scaleTime().domain(xDomain);

  const getTrendPoints = (trend: Date[], extend: [number, number]) =>
    trend.length > 0
      ? trend.map((date, i) => ({ x: date.getTime(), y: i }))
      : [
          { x: extend[0], y: 0 },
          { x: extend[1], y: 0 },
        ];

  $: lines = trends.map((trend) => ({
    id: trend.name,
    title: trend.name,
    points: getTrendPoints(trend.trend, xDomain),
  }));

  function showListModal(e: CustomEvent<{ id: string } | undefined>) {
    if (!e.detail?.id) return;

    modalState.append({
      modalType: "article-list",
      modalContent: {
        articles: getBaseArticles({
          limit: 0,
          sort_by: "publish_date",
          sort_order: "desc",
          highlight: true,
          search_term: `"${e.detail.id}"`,
        }),
      },
    });
  }
</script>

<TagLine {keywords} bind:hoverText />

<Linechart
  {lines}
  hoveredLines={hoverText.length > 0 ? [hoverText] : []}
  {customXAxisScale}
  {xDomain}
  containerClass="h-full -ml-4"
  on:click={showListModal}
/>
