<script lang="ts">
  import type { Cluster } from "$shared/types/api";
  import { getPathPoints, type ClusterWithDate, type Point } from "./data";

  import * as d3 from "d3";
  import { afterUpdate, onMount } from "svelte";
  import { searchInCluster } from "$lib/common/filter";
  import { drawLines } from "./canvas";
  import { goto } from "$app/navigation";

  export let search: string;
  export let clusters: Cluster[];

  let svg: SVGElement;
  let tipSvg: SVGElement; // Used for displaying tooltips
  let xAxis: SVGGElement;
  let yAxis: SVGGElement;
  let canvas: HTMLCanvasElement;
  $: ctx = canvas?.getContext("2d");

  const margins: { [key in "top" | "bottom" | "left" | "right"]: number } = {
    top: 20,
    bottom: 20,
    left: 30,
    right: 30,
  };

  let height: number = 0;
  let width: number = 0;
  let pointer: null | Point = null;

  let xm: number, ym: number;

  $: innerHeight = height - margins.top - margins.bottom;
  $: innerWidth = width - margins.left - margins.right;

  let clustersWithDate: ClusterWithDate[];
  $: clustersWithDate = clusters.map((cluster) => ({
    ...cluster,
    dating: cluster.dating
      .map((date) => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime()),
  }));

  let processedClusters: ClusterWithDate[];
  $: processedClusters =
    search.length > 0
      ? clustersWithDate.filter((c) => searchInCluster(c, search))
      : clustersWithDate;

  $: documentCounts = processedClusters.map((c) => c.document_count);

  $: scaleX = d3
    .scaleTime()
    .domain([new Date("2022"), new Date()])
    .range([margins.left, width - margins.right]);

  $: scaleY = d3
    .scaleLinear()
    .domain([0, d3.max(documentCounts)] as [number, number])
    .nice()
    .range([height - margins.bottom, margins.top]);

  $: d3.select(xAxis).call(
    d3
      .axisBottom(scaleX)
      .ticks(width / 80)
      .tickSizeOuter(0)
  );
  $: d3.select(yAxis)
    .call(d3.axisLeft(scaleY))
    .call((g) =>
      g
        .selectAll(".tick line")
        .attr("x2", width - margins.left - margins.right)
        .attr("stroke-opacity", 0.2)
    );

  let pathPoints: Promise<Point[]>;
  $: pathPoints = getPathPoints(processedClusters, scaleX, scaleY);

  async function pointermoved(event: d3.ClientPointEvent) {
    const points = await pathPoints;

    [xm, ym] = d3.pointer(event);

    const closePoint = d3.least(points, (point) =>
      Math.hypot(point.x - xm, point.y - ym)
    );

    if (!closePoint) return;

    pointer = closePoint;
  }

  $: d3.select(tipSvg).on("pointermove", (e: d3.ClientPointEvent) => {
    pointermoved(e);
    drawLines(processedClusters, ctx, pointer, scaleX, scaleY);
  });

  $: d3.select(tipSvg).on("pointerleave", () => {
    pointer = null;
    drawLines(processedClusters, ctx, pointer, scaleX, scaleY);
  });

  $: d3.select(tipSvg).on("click", () => {
    if (!pointer) return;
    goto(`/topic/${pointer.cluster.id}`);
  });

  afterUpdate(() => {
    drawLines(processedClusters, ctx, pointer, scaleX, scaleY);
  });

  onMount(() => {
    setTimeout(
      () => drawLines(processedClusters, ctx, null, scaleX, scaleY),
      100
    );
  });
</script>

<div
  id="map-container"
  class="w-full h-[30rem] relative"
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <svg
    bind:this={svg}
    {width}
    {height}
    viewBox="0 0 {width} {height}"
    class="absolute dark:text-white"
  >
    <g bind:this={xAxis} transform="translate(0,{height - margins.bottom})" />
    <g bind:this={yAxis} transform="translate({margins.left},0)">
      <text x={-margins.left} y="10" fill="currentColor" text-anchor="start"
        >↑ Documents per cluster</text
      >
    </g>
  </svg>

  <canvas
    bind:this={canvas}
    width={innerWidth}
    height={innerHeight}
    style="margin: {margins.top}px {margins.right}px {margins.bottom}px {margins.left}px"
    class="absolute"
  />

  <svg
    bind:this={tipSvg}
    width={innerWidth}
    height={innerHeight}
    viewBox="0 0 {innerWidth} {innerHeight}"
    style="margin: {margins.top}px {margins.right}px {margins.bottom}px {margins.left}px"
    class="absolute dark:text-white font-thin"
  >
    {#if pointer}
      <g
        fill="currentColor"
        stroke="currentColor"
        transform="translate({pointer.x}, {pointer.y})"
        stroke-width="1.5"
      >
        <text y="-20" fill="currentColor" text-anchor="middle">
          {pointer.cluster.title.slice(0, 100)}
          {pointer.cluster.title.length > 100 ? "..." : ""}
        </text>
        <circle r="5" />
      </g>
    {/if}
  </svg>
</div>
