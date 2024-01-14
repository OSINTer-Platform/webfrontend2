<script lang="ts">
  import * as d3 from "d3";

  import Linechart from "$com/charts/linechart/index.svelte";
  import TrendInput from "./trendInput.svelte";

  import type { Trend } from "./common";
  import type { Writable } from "svelte/store";

  export let trends: Trend[];
  export let startDate: Date;
  export let keywords: Writable<string[]>;

  let xDomain: [number, number];
  $: xDomain = [startDate.getTime(), new Date().getTime()];

  $: customXAxisScale = d3.scaleTime().domain(xDomain);

  $: lines = trends.map((trend) => ({
    title: trend.name,
    href: `/feed/search?sort_by=publish_date&highlight=true&search_term=${encodeURIComponent(
      `"${trend.name}"`
    )}`,
    points: trend.trend.map((date, i) => ({
      x: date.getTime(),
      y: i + 1,
    })),
  }));
</script>

<TrendInput {keywords} />

<Linechart
  {lines}
  {customXAxisScale}
  {xDomain}
  containerClass="h-full w-full"
/>
