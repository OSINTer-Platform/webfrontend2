<!-- Work in progress -->

<script lang="ts">
  import * as d3 from "d3";
  export let items: Array<{ key: string; value: number }>;

  let outerWidth: number = 0;
  let outerHeight: number = 0;

  const margins = { top: 0, right: 20, bottom: 0, left: 0 };

  $: svgWidth = outerWidth - margins.left - margins.right;
  $: svgHeight = outerHeight - margins.top - margins.bottom;

  $: x = d3
    .scaleBand(
      items.map((item) => item.key),
      [0, svgWidth]
    )
    .padding(0.2);

  $: y = d3.scaleLinear(
    [0, d3.max(items, (item) => item.value) ?? 0],
    [svgHeight, 0]
  );

  function getBars(_: number, height: number) {
    return items.map(({ key, value }) => ({
      height: height - y(value),
      width: x.bandwidth(),
      y: y(value),
      x: x(key) ?? 0,
      fill: "#d4163c",
    }));
  }

  $: bars = getBars(svgWidth, svgHeight);
</script>

<div
  bind:clientWidth={outerWidth}
  bind:clientHeight={outerHeight}
  id="source-chart"
  class="w-full overflow-hidden grow relative"
  style="padding: {margins.top}px {margins.right}px {margins.bottom}px {margins.left}px"
>
  <svg width={svgWidth} height={svgHeight}>
    {#each bars as { height, width, y, x, fill }}
      <rect {height} {width} {y} {x} {fill} />
    {/each}
  </svg>

  <aside class="" />
</div>
