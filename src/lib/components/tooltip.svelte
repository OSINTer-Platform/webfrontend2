<script lang="ts">
  import { tooltip } from "$shared/state/state";
  import { derived } from "svelte/store";
  import { fade } from "svelte/transition";

  let container: HTMLDivElement;

  const translateX = derived(tooltip, ($tooltip) => {
    if (!container || !$tooltip) return -50;

    const leftBound = 20;
    const rightBound = window.innerWidth - leftBound;

    const containerWidth = container.offsetWidth;

    if ($tooltip.x + containerWidth / 2 > rightBound)
      return ((rightBound - $tooltip.x) / containerWidth) * 100 - 100;
    else if ($tooltip.x - containerWidth / 2 < leftBound)
      return (($tooltip.x - leftBound) / containerWidth) * -100;
    else return -50;
  });
</script>

{#if $tooltip}
  <div
    transition:fade={{ duration: 100 }}
    bind:this={container}
    class="
      hidden sm:block
      text-nowrap w-max
      text-xs sm:text-sm md:text-base
      bg-black text-white
      absolute z-50
      -translate-y-[130%]
    "
    style="
      padding: {$tooltip.padding ?? '12'}px;
      top: {$tooltip.y}px;
      left: {$tooltip.x}px;
      transform: translate({$translateX}%, -130%);"
  >
    {#if typeof $tooltip.text === "string"}
      <p>{$tooltip.text}</p>
    {:else}
      <p class="font-bold text-sm sm:text-base md:text-lg">
        {$tooltip.text.title}
      </p>
      <p>{$tooltip.text.description}</p>
    {/if}
  </div>
{/if}
