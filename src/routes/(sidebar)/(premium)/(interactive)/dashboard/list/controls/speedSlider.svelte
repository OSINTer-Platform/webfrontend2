<script lang="ts">
  import * as d3 from "d3";

  export let value: number;
  let clientWidth: number = 0;
  let min = 0.2;
  let max = 6;

  $: x = d3
    .scaleLinear()
    .domain([min, max])
    .range([16, clientWidth - 32]);

  $: tooltipX = x(value);
</script>

<div
  class="min-w-32 lg:min-w-64 w-full flex rounded-full bg-black"
  bind:clientWidth
>
  <input
    on:change
    bind:value
    type="range"
    {min}
    {max}
    step="0.2"
    class="
      basis-0 w-4 shrink grow h-2 my-4 mx-4

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
    <span class="font-light text-xs">Speed</span>
    <span>{value}x</span>
  </div>
</div>
