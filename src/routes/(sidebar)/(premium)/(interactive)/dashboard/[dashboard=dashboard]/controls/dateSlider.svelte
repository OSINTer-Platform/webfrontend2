<script lang="ts">
  import { getTimespan } from "$lib/common/math";
  import * as d3 from "d3";

  const maxDate = new Date().setDate(new Date().getDate() - 1);
  const minDate = new Date().setMonth(new Date().getMonth() - 3);

  export let date: Date;
  $: date = new Date(value);
  $: timespan = getTimespan(date.toISOString());
  $: prettyDate = date.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let value: number = date.valueOf();
  let slider: HTMLInputElement | undefined;

  $: x = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([8, slider?.clientWidth ? slider.clientWidth - 8 : 0]);

  $: tooltipX = x(value);
</script>

<div
  class="
  shrink grow flex rounded-full

  bg-black opacity-5
  transition-color duration-300
"
>
  <input
    on:change
    bind:this={slider}
    bind:value
    type="range"
    min={minDate}
    max={maxDate}
    step={1000 * 60 * 60 * 24}
    class="
      basis-0 w-16 shrink grow h-2 my-4 mx-4

      cursor-pointer
      appearance-none

      rounded-full accent-primary-500
      bg-primary-800 hover:bg-primary-600

      transition-all duration-300
      peer
    "
  />

  <div
    style="left: {tooltipX + 8}px;"
    class="
    opacity-0 peer-hover:opacity-100
    transition-opacity duration-300
    absolute -top-16 -translate-x-1/2
    p-2 rounded-sm
    bg-black w-max text-white
    flex flex-col text-center
  "
  >
    <span>{timespan}</span>
    <span class="font-light text-xs">{prettyDate}</span>
  </div>
</div>
