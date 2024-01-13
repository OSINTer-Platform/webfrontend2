<script lang="ts">
  import { getPathPoints, type Point, type Line } from "./data";

  import * as d3 from "d3";
  import { afterUpdate, onMount } from "svelte";
  import { drawLines as drawCanvas } from "./canvas";
  import { goto } from "$app/navigation";

  export let lines: Line[];

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

  let svg: SVGElement;
  let tipSvg: SVGElement; // Used for displaying tooltips
  let xAxis: SVGGElement;
  let yAxis: SVGGElement;
  let canvas: HTMLCanvasElement;
  $: ctx = canvas?.getContext("2d");

  const margins = {
    top: 20,
    bottom: 20,
    left: 40,
    right: 30,
  };

  let height: number = 0;
  let width: number = 0;
  let pointer: null | Point = null;

  let xm: number, ym: number;

  $: innerHeight = height - margins.top - margins.bottom;
  $: innerWidth = width - margins.left - margins.right;

  const getAllCords = (lines: Line[], axis: "x" | "y") =>
    lines.map((line) => line.points.map((point) => point[axis])).flat();

  $: scaleX = d3
    .scaleLinear()
    .domain(xDomain ?? (d3.extent(getAllCords(lines, "x")) as [number, number]))
    .range([0, innerWidth]);

  $: scaleY = d3
    .scaleLinear()
    .domain(yDomain ?? (d3.extent(getAllCords(lines, "y")) as [number, number]))
    .nice()
    .range([innerHeight, 0]);

  function processLines(
    lines: Line[],
    scaleX: d3.ScaleLinear<number, number, never>,
    scaleY: d3.ScaleLinear<number, number, never>
  ) {
    const processed = lines.map(({ title, href, points }) => ({
      title,
      href,
      points: points.map(({ x, y }) => ({
        x: scaleX(x),
        y: scaleY(y),
      })),
    }));

    processed.forEach((line) => {
      line.points.push({
        x: innerWidth,
        y: line.points.at(-1)?.y ?? scaleY(0),
      });

      line.points.unshift({
        x: line.points[0].x,
        y: innerHeight,
      });
    });

    return processed;
  }

  $: processedLines = processLines(lines, scaleX, scaleY);

  $: xAxisScale = (customXAxisScale ?? scaleX.copy()).range([
    margins.left,
    width - margins.right,
  ]);
  $: yAxisScale = (customYAxisScale ?? scaleY.copy()).range([
    height - margins.bottom,
    margins.top,
  ]);

  $: d3.select(xAxis).call(
    d3
      .axisBottom(xAxisScale as any)
      .ticks(width / 80)
      .tickSizeOuter(0)
  );
  $: d3.select(yAxis)
    .call(d3.axisLeft(yAxisScale as any))
    .call((g) =>
      g
        .selectAll(".tick line")
        .attr("x2", width - margins.left - margins.right)
        .attr("stroke-opacity", 0.2)
    );

  $: pathPoints = getPathPoints(processedLines, hoverLinePrecision);

  async function pointermoved(event: d3.ClientPointEvent) {
    [xm, ym] = d3.pointer(event);

    const closePoint = d3.least(pathPoints, (point) =>
      Math.hypot(point.x - xm, point.y - ym)
    );

    if (!closePoint) return;

    pointer = closePoint;
  }

  const drawLines = () => drawCanvas(processedLines, ctx, pointer?.line);

  $: d3.select(tipSvg).on("pointermove", (e: d3.ClientPointEvent) => {
    pointermoved(e);
    drawLines();
  });

  $: d3.select(tipSvg).on("pointerleave", () => {
    pointer = null;
    drawLines();
  });

  $: d3.select(tipSvg).on("click", () => {
    const href = pointer?.line.href;
    if (href) goto(href);
  });

  afterUpdate(() => {
    drawLines();
  });

  onMount(() => {
    setTimeout(() => drawLines(), 100);
  });
</script>

<div
  id="map-container"
  class="{containerClass} relative"
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
        >{yAxisText}</text
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
          {pointer.line.title.slice(0, 100)}
          {pointer.line.title.length > 100 ? "..." : ""}
        </text>
        <circle r="5" />
      </g>
    {/if}
  </svg>
</div>
