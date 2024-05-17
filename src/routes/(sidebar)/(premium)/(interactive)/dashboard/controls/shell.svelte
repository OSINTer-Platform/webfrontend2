<script lang="ts">
  import DoubleSlider from "$com/utils/inputs/time/doubleSlider.svelte";
  import LogoIcon from "$assets/LogoIcon.svelte";
  import Navigator from "./navigator.svelte";

  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { createEventDispatcher } from "svelte";
  import { firstDate } from "$shared/config";
  import { slide } from "svelte/transition";

  export let startDate: Date;
  export let endDate: Date;

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

  const genPastDate = (days: number) =>
    new Date(new Date().setDate(new Date().getDate() - days));

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
</script>

<aside
  class="
  absolute

  bottom-2 left-2 right-2
  sm:bottom-4 sm:left-5 sm:right-5
  xl:left-10 xl:right-10
  2xl:left-20 2xl:right-20

  flex gap-1 sm:gap-4

  [&>div]:opacity-5 [&:hover>div]:opacity-100
  [&>div]:duration-300
"
>
  <div
    class="
    flex rounded-3xl overflow-hidden shrink-0
    bg-black
  "
  >
    <a
      title="Return to homepage"
      href="/"
      class="
        btn shrink-0
        my-auto w-10 aspect-square
        text-white
      "
    >
      <LogoIcon class="h-4 w-4" mode="dark" />
    </a>
  </div>
  <div class="shrink grow flex gap-1 sm:gap-4">
    <slot />
    <div
      on:pointerenter={() => (hoveringRanges = true)}
      on:pointerleave={() => (hoveringRanges = false)}
      class="
      px-2 grow shrink max-w-max
      flex justify-center items-center
      bg-black rounded-full
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
      class="grow flex bg-black justify-center items-center px-4 rounded-full"
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
  </div>
  <Navigator />
</aside>
