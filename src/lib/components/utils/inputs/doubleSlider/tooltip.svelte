<script lang="ts">
  export let firstX: number;
  export let lastX: number;

  export let firstTooltipValue: string;
  export let lastTooltipValue: string;

  export let containerWidth: number;

  const getWidth = (el: HTMLDivElement | undefined, _: any) => el?.offsetWidth;

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
</script>

<aside
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
        <span>{firstTooltipValue}</span>
      </div>
    </div>

    <div class="tooltip">
      <div
        style="max-width: max({lastX - lastTooltipWidth / 2}px, 0px);"
        class="grow shrink"
      />
      <div bind:this={lastTooltip} class="content">
        <span class="">{lastTooltipValue}</span>
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
        <span class="">{firstTooltipValue} - {lastTooltipValue}</span>
      </div>
    </div>
  {/if}
</aside>

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
</style>
