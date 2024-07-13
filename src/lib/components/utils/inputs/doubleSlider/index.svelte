<script lang="ts" context="module">
  export type Config = {
    showTooltip: boolean;
    hoverTooltip: boolean;
    rounded: boolean;
    backgroundColor: string;
    foregroundColor: string;
  };
</script>

<script lang="ts">
  import * as d3 from "d3";
  import Tooltip from "./tooltip.svelte";
  import { createEventDispatcher } from "svelte";

  export let config: Partial<Config> = {};

  export let minValue: number;
  export let maxValue: number;

  export let firstValue: number;
  export let lastValue: number;

  export let stepSize: number;

  export let formatNumber: (n: number) => string;

  const defaultConfig: Config = {
    showTooltip: true,
    hoverTooltip: true,
    rounded: false,
    backgroundColor: "bg-gray-400/25",
    foregroundColor: "bg-primary-600",
  };

  let mergedConfig: Config;
  $: mergedConfig = { ...defaultConfig, ...config };

  const dispatch = createEventDispatcher<{
    change: { firstValue: number; lastValue: number };
  }>();

  const clampValue = (val: number) =>
    Math.min(Math.max(val, minValue), maxValue);

  let containerWidth: number;

  let lastMiddleDragX: number | null = null;

  $: x = d3
    .scaleLinear()
    .domain([minValue, maxValue])
    .range([0, containerWidth]);

  $: lastValue = clampValue(lastValue);
  $: firstValue =
    firstValue > lastValue - stepSize
      ? lastValue - stepSize
      : clampValue(firstValue);

  $: firstX = x(firstValue);
  $: lastX = x(lastValue);

  $: firstTooltipValue = formatNumber(firstValue);
  $: lastTooltipValue = formatNumber(lastValue);

  const change = () => dispatch("change", { firstValue, lastValue });
</script>

<div
  class:mt-10={!mergedConfig.hoverTooltip && mergedConfig.showTooltip}
  class="
    grow relative
    {mergedConfig.hoverTooltip
    ? '[&:hover>aside]:opacity-100'
    : '[&>aside]:opacity-100'}
  "
  on:pointerleave={() => {
    if (lastMiddleDragX) change();
    lastMiddleDragX = null;
  }}
  on:pointermove={(e) => {
    if (!lastMiddleDragX) return;
    const diff = e.x - lastMiddleDragX;
    const newFirstX = Math.min(Math.max(firstX + diff, 0), containerWidth);
    const newLastX = Math.min(Math.max(lastX + diff, 0), containerWidth);

    firstValue = x.invert(newFirstX);
    lastValue = x.invert(newLastX);

    lastMiddleDragX = e.x;
  }}
>
  {#if mergedConfig.showTooltip}
    <Tooltip
      {containerWidth}
      {firstX}
      {lastX}
      {firstTooltipValue}
      {lastTooltipValue}
    />
  {/if}

  <div
    class:rounded-full={mergedConfig.rounded}
    class="
      grow flex
      relative h-2
      {mergedConfig.backgroundColor ?? 'bg-gray-400/25'}
    "
    bind:clientWidth={containerWidth}
  >
    <div
      on:pointerdown={(e) => (lastMiddleDragX = e.x)}
      on:pointerup={() => {
        if (lastMiddleDragX) change();
        lastMiddleDragX = null;
      }}
      class="
        absolute h-full cursor-col-resize rounded-full
        {mergedConfig.foregroundColor ?? 'bg-primary-600 '}
      "
      style="
        left: max({firstX}px, 0px);
        right: max({containerWidth - lastX}px, 0px);
        "
    />
    <input
      on:change={() => change()}
      bind:value={firstValue}
      type="range"
      min={minValue}
      max={maxValue}
      step={stepSize}
      class="w-full absolute -translate-y-1/2 top-1/2"
      style="--rounded: {mergedConfig.rounded ? '9999' : '0'}px"
    />
    <input
      on:change={() => change()}
      bind:value={lastValue}
      type="range"
      min={minValue}
      max={maxValue}
      step={stepSize}
      class="w-full absolute -translate-y-1/2 top-1/2"
      style="--rounded: {mergedConfig.rounded ? '9999' : '0'}px"
    />
  </div>
</div>

<style lang="postcss">
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    background: none;
    pointer-events: none;

    &::-webkit-slider-runnable-track,
    &::-moz-range-track {
      -webkit-appearance: none;
      appearance: none;
      background: none;
    }

    &::-moz-range-thumb {
      background: white;
      border: none;
      pointer-events: auto;
      cursor: pointer;
      border-radius: var(--rounded);
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;

      height: 1rem;
      width: 1rem;
      background: white;

      pointer-events: auto;
      cursor: pointer;
      border-radius: var(--rounded);
    }
  }
</style>
