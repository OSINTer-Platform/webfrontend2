<script lang="ts">
  import * as d3 from "d3";
  import { onMount, createEventDispatcher } from "svelte";

  export let config:
    | {
        hoverTitles?: boolean;
        rounded?: boolean;
        backgroundColor?: string;
        foregroundColor?: string;
      }
    | undefined = undefined;

  const dispatch = createEventDispatcher<{
    change: { firstDate: Date; lastDate: Date };
  }>();

  const maxDate = new Date().setDate(new Date().getDate() - 1);
  const minDate = new Date().setFullYear(new Date().getFullYear() - 3);

  let externalFirstDate: Date | null;
  let externalLastDate: Date | null;

  let firstValue: number = minDate;
  let lastValue: number = maxDate;

  $: firstValue =
    firstValue > lastValue - 1000 * 60 * 60 * 24
      ? lastValue - 1000 * 60 * 60 * 24
      : firstValue;

  $: firstDate = new Date(firstValue);
  $: lastDate = new Date(lastValue);

  $: prettyFirstDate = firstDate.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  $: prettyLastDate = lastDate.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let containerWidth: number = 0;

  $: x = d3.scaleTime().domain([minDate, maxDate]).range([0, containerWidth]);

  $: firstX = x(firstValue);
  $: lastX = x(lastValue);

  let firstTooltip: HTMLDivElement | undefined = undefined;
  let lastTooltip: HTMLDivElement | undefined = undefined;
  let combinedTooltip: HTMLDivElement | undefined = undefined;

  let firstTooltipWidth: number = 0;
  let lastTooltipWidth: number = 0;
  let combinedTooltipWidth: number = 0;

  $: firstTooltipWidth = getWidth(firstTooltip, firstX) ?? firstTooltipWidth;
  $: lastTooltipWidth = getWidth(lastTooltip, lastX) ?? lastTooltipWidth;
  $: combinedTooltipWidth =
    getWidth(combinedTooltip, [firstX, lastX]) ?? combinedTooltipWidth;

  const getWidth = (el: HTMLDivElement | undefined, _: any) => el?.offsetWidth;

  let lastMiddleDragX: number | null = null;

  onMount(() => {
    console.log(externalFirstDate, externalLastDate);
    if (externalFirstDate && externalFirstDate.getTime() > minDate)
      firstValue = externalFirstDate.getTime();
    if (externalLastDate && externalLastDate.getTime() > maxDate)
      lastValue = externalLastDate.getTime();
  });

  function sync() {
    externalFirstDate = firstDate;
    externalLastDate = lastDate;
    dispatch("change", {
      firstDate: externalFirstDate,
      lastDate: externalLastDate,
    });
  }

  export {
    externalFirstDate as firstDate,
    externalLastDate as lastDate,
    firstDate as internalFirstDate,
    lastDate as internalLastDate,
  };
</script>

<div
  class:mt-10={!config?.hoverTitles}
  class="
    grow relative
    {config?.hoverTitles ? '[&:hover>aside]:opacity-100' : ''}
  "
  on:pointerleave={() => {
    if (lastMiddleDragX) sync();
    lastMiddleDragX = null;
  }}
  on:pointermove={(e) => {
    if (!lastMiddleDragX) return;
    const diff = e.x - lastMiddleDragX;
    const newFirstX = Math.min(Math.max(firstX + diff, 0), containerWidth);
    const newLastX = Math.min(Math.max(lastX + diff, 0), containerWidth);

    firstValue = x.invert(newFirstX).getTime();
    lastValue = x.invert(newLastX).getTime();

    lastMiddleDragX = e.x;
  }}
>
  <aside
    class:opacity-0={config?.hoverTitles}
    class="
    flex h-8 absolute
    right-0 left-0 top-0
    -translate-y-full
    transition-opacity
  "
  >
    {#if Math.min(lastX, containerWidth - lastTooltipWidth / 2) - Math.max(firstX, firstTooltipWidth / 2) > firstTooltipWidth / 2 + lastTooltipWidth / 2 + 10}
      <div class="tooltip">
        <div
          style="max-width: max({firstX - firstTooltipWidth / 2}px, 0px);"
          class="grow shrink"
        />
        <div bind:this={firstTooltip} class="content">
          <span>{prettyFirstDate}</span>
        </div>
      </div>

      <div class="tooltip">
        <div
          style="max-width: max({lastX - lastTooltipWidth / 2}px, 0px);"
          class="grow shrink"
        />
        <div bind:this={lastTooltip} class="content">
          <span class="">{prettyLastDate}</span>
        </div>
      </div>
    {:else}
      <div class="tooltip">
        <div
          style="max-width: max({(firstX + lastX) / 2 -
            combinedTooltipWidth / 2}px, 0px);"
          class="grow shrink"
        />
        <div bind:this={combinedTooltip} class="content">
          <span class="">{prettyFirstDate} - {prettyLastDate}</span>
        </div>
      </div>
    {/if}
  </aside>

  <div
    class:rounded-full={config?.rounded}
    class="
      grow flex
      relative h-2
      {config?.backgroundColor ?? 'bg-gray-400/25'}
    "
    bind:clientWidth={containerWidth}
  >
    <div
      on:pointerdown={(e) => (lastMiddleDragX = e.x)}
      on:pointerup={() => {
        if (lastMiddleDragX) sync();
        lastMiddleDragX = null;
      }}
      class="
        absolute -translate-x-2 h-full cursor-col-resize rounded-full
        {config?.foregroundColor ?? 'bg-primary-600 '}
      "
      style="left: {firstX}px; right: max({containerWidth - lastX}px, 0px);"
    />
    <input
      on:change={() => sync()}
      bind:value={firstValue}
      type="range"
      min={minDate}
      max={maxDate}
      step={1000 * 60 * 60 * 24}
      class="w-full absolute -translate-y-1/2 top-1/2"
      style="--rounded: {config?.rounded ? '9999' : '0'}px"
    />
    <input
      on:change={() => sync()}
      bind:value={lastValue}
      type="range"
      min={minDate}
      max={maxDate}
      step={1000 * 60 * 60 * 24}
      class="w-full absolute -translate-y-1/2 top-1/2"
      style="--rounded: {config?.rounded ? '9999' : '0'}px"
    />
  </div>
</div>

<style lang="postcss">
  .tooltip {
    @apply absolute left-0 right-0 top-0 bottom-0 flex;

    .content {
      @apply p-1 w-max text-center
      bg-black;

      span {
        @apply text-sm select-none text-white;
      }
    }
  }
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

    &::-webkit-slider-thumb,
    &::-moz-range-thumb {
      background: white;
      border: none;
      pointer-events: auto;
      cursor: pointer;
      border-radius: var(--rounded);
    }
  }
</style>
