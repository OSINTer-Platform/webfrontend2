<script lang="ts">
  import type * as d3 from "d3";

  import Chart from "./chart.svelte";

  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  import type { Line } from "./data";

  export let lines: Line[];
  export let hoveredLines: string[] = [];
  $: hoveredLines = hoveredLines ?? [];
  // See https://github.com/sveltejs/svelte/issues/11647

  export let xDomain: undefined | [number, number] = undefined;
  export let yDomain: undefined | [number, number] = undefined;

  type CustomScale = d3.AxisScale<d3.NumberValue> & {
    range: (range: d3.NumberValue[]) => d3.NumberValue[];
  };
  export let customXAxisScale: undefined | CustomScale = undefined;
  export let customYAxisScale: undefined | CustomScale = undefined;

  export let hoverLinePrecision = 50;
  export let containerClass = "";
  export let yAxisText = "";

  let mount = false;

  onMount(() => {
    if (browser) mount = true;
  });
</script>

{#if mount}
  <Chart
    {lines}
    {hoveredLines}
    {xDomain}
    {yDomain}
    {customXAxisScale}
    {customYAxisScale}
    {hoverLinePrecision}
    {containerClass}
    {yAxisText}
    on:click
  >
    <slot />
  </Chart>
{/if}
