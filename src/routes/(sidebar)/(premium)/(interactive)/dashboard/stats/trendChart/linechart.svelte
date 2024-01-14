<script lang="ts">
  import * as d3 from "d3";

  import Linechart from "$com/charts/linechart/index.svelte";

  import type { Trend } from "./common";

  export let trends: Trend[];
  export let startDate: Date;

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

<Linechart {lines} {customXAxisScale} {xDomain} containerClass="h-full w-full"
  ><slot /></Linechart
>
