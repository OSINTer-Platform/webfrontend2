<script lang="ts">
  import DoubleSlider from "$com/utils/inputs/time/doubleSlider.svelte";
  import LogoIcon from "$assets/LogoIcon.svelte";
  import Navigator from "./navigator.svelte";

  import { genPastDate } from "$lib/common/math";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { createEventDispatcher } from "svelte";
  import { firstDate } from "$shared/config";
  import { slide } from "svelte/transition";
  import Fa from "svelte-fa";
  import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";

  export let startDate: Date;
  export let endDate: Date;
  export let extraElCount;

  const dispatch = createEventDispatcher<{
    date: { startDate: Date; endDate: Date };
  }>();

  function changeDate() {
    const url = new URL($page.url);
    url.searchParams.set("startDate", startDate.toISOString());
    url.searchParams.set("endDate", endDate.toISOString());
    goto(url, { replaceState: true });

    dispatch("date", { startDate: startDate, endDate: endDate });
  }


  const dateRanges: {
    title: string;
    text: string;
    minDate: Date;
  }[] = [
    { title: "All time", text: "all", minDate: firstDate },
    { title: "Last year", text: "year", minDate: genPastDate(365) },
    { title: "Last 6 months", text: "6 months", minDate: genPastDate(6 * 30) },
    { title: "Last 3 months", text: "3 months", minDate: genPastDate(3 * 30) },
  ];

  let selectedDateRange: {
    title: string;
    text: string;
    minDate: Date;
  } = dateRanges[3];

  let hoveringRanges = false;
  let showControls = true;
</script>

<aside
  class="
  absolute

  bottom-0 left-2 right-2
  sm:left-5 sm:right-5
  xl:left-10 xl:right-10
  2xl:left-20 2xl:right-20
  flex flex-col items-center
"
>
  <button
    on:click={() => (showControls = !showControls)}
    class="rounded-full p-2 btn"
  >
    <Fa
      icon={faAngleDoubleDown}
      class="
        text-2xl transition-transform duration-500 delay-300
        {showControls ? '' : 'rotate-180'}
      "
    />
  </button>

  {#if showControls}
    <main
      style="--extra-element-count: {extraElCount}"
      class:extraElement={extraElCount > 0}
      class="
        gap-1 sm:gap-4 w-full mb-4
      "
      transition:slide
    >
      <div
        class="
        w-10 flex shrink-0 overflow-hidden
        bg-black rounded-full
      "
      >
        <a
          title="Return to homepage"
          href="/"
          class="
            btn shrink-0 w-full h-full
            my-auto aspect-square
            text-white
          "
        >
          <LogoIcon class="h-4 w-4" mode="dark" />
        </a>
      </div>

      <slot />

      <div
        class:ml-[4.5rem]={extraElCount < 1}
        on:pointerenter={() => (hoveringRanges = true)}
        on:pointerleave={() => (hoveringRanges = false)}
        class="
        px-2 grow shrink max-w-max
        flex justify-center items-center
        bg-black rounded-full
        lg:ml-0
      "
      >
        {#each dateRanges as dateRange}
          {@const selected = selectedDateRange.text === dateRange.text}
          {#if hoveringRanges || selected}
            <button
              transition:slide={{ axis: "x" }}
              title={dateRange.title}
              on:click={() => (selectedDateRange = dateRange)}
              class="
                btn py-1 px-2
                border border-primary-500 border-r-0
                first:rounded-l-full last:rounded-r-full last:border-r
                text-sm uppercase font-bold whitespace-nowrap
                {selected
                ? 'bg-primary-900/50'
                : '!text-primary-500 bg-primary-500/10'}
              "
            >
              {dateRange.text}
            </button>
          {/if}
        {/each}
      </div>
      <div
        class="
        expander w-full px-4
        flex justify-center items-center
        bg-black rounded-full
        row-start-1
      "
      >
        <DoubleSlider
          on:change={changeDate}
          minDate={selectedDateRange.minDate}
          bind:firstDate={startDate}
          bind:lastDate={endDate}
          config={{
            hoverTitles: true,
            rounded: true,
            backgroundColor: "bg-primary-900/75",
            foregroundColor: "bg-primary-500",
          }}
        />
      </div>
      <Navigator containerClass="navigator" />
    </main>
  {/if}
</aside>

<style lang="postcss">
  main {
    display: grid;
    justify-items: center;

    grid-template-columns: max-content auto max-content;
    grid-template-rows: repeat(2, minmax(0, 1fr));

    & > div.expander {
      grid-column: 1 / -1;
      grid-row-start: 2;
    }

    &.extraElement {
      grid-template-columns:
        max-content repeat(var(--extra-element-count), auto)
        max-content max-content;
    }

    @media (min-width: 1024px) {
      grid-template-columns: max-content max-content auto max-content;
      grid-template-rows: repeat(1, minmax(0, 1fr));

      & > div.expander {
        grid-column: calc(var(--extra-element-count) + 3) / auto;
        grid-row-start: 1;
      }

      &.extraElement {
        grid-template-columns:
          max-content
          repeat(var(--extra-element-count), max-content)
          max-content auto max-content;
      }
    }
  }
</style>
