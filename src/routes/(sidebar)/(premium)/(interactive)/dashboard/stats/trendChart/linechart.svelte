<script lang="ts">
  import * as d3 from "d3";

  import Linechart from "$com/charts/linechart/index.svelte";
  import TagLine from "../tagline.svelte";

  import type { Trend } from "./common";
  import type { Writable } from "svelte/store";

  export let trends: Trend[];
  export let startDate: Date;
  export let keywords: Writable<string[]>;

  let hoverText = "";

  let xDomain: [number, number];
  $: xDomain = [startDate.getTime(), new Date().getTime()];

  $: customXAxisScale = d3.scaleTime().domain(xDomain);

  const getTrendPoints = (trend: Date[], extend: [number, number]) =>
    trend.length > 0
      ? trend.map((date, i) => ({ x: date.getTime(), y: i }))
      : [
          { x: extend[0], y: 0 },
          { x: extend[1], y: 0 },
        ];

  $: lines = trends.map((trend) => ({
    title: trend.name,
    href: `/feed/search?sort_by=publish_date&highlight=true&search_term=${encodeURIComponent(
      `"${trend.name}"`
    )}`,
    points: getTrendPoints(trend.trend, xDomain),
  }));
</script>

<TagLine {keywords} bind:hoverText />

<Linechart
  {lines}
  hoveredLines={hoverText.length > 0 ? [hoverText] : []}
  {customXAxisScale}
  {xDomain}
  containerClass="h-full -ml-4"
/>
