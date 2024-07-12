<script lang="ts">
  import DoubleSlider from "$com/utils/inputs/time/doubleSlider.svelte";
  import LogoIcon from "$assets/LogoIcon.svelte";
  import Navigator from "./navigator.svelte";
  import DateRangeBtn from "./dateRangeBtn.svelte";

  import { estimateTimeEquality, genPastDate } from "$lib/common/math";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { createEventDispatcher } from "svelte";
  import { firstDate } from "$shared/config";
  import { slide } from "svelte/transition";
  import Fa from "svelte-fa";
  import {
    faAngleDoubleDown,
    faCaretLeft,
  } from "@fortawesome/free-solid-svg-icons";

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

  const getDateRange = (startDate: Date, endDate: Date) =>
    estimateTimeEquality(endDate, maxDate)
      ? dateRanges
          .filter(({ minDate }) => estimateTimeEquality(minDate, startDate))
          .at(0) ?? null
      : null;

  const maxDate: Date = new Date();

  const dateRanges: {
    title: string;
    text: string;
    minDate: Date;
  }[] = [
    { title: "All time", text: "All", minDate: firstDate },
    { title: "Last year", text: "Year", minDate: genPastDate(365) },
    { title: "Last 6 months", text: "6 months", minDate: genPastDate(6 * 30) },
    { title: "Last month", text: "Month", minDate: genPastDate(30) },
    { title: "Last week", text: "Week", minDate: genPastDate(7) },
    { title: "Last day", text: "Day", minDate: genPastDate(1) },
  ];

  let selectedDateRange: {
    title: string;
    text: string;
    minDate: Date;
  } | null;

  $: selectedDateRange = getDateRange(startDate, endDate);

  let showRanges = true;
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

      <section
        class:ml-[4.5rem]={extraElCount < 1}
        class="
        px-2 grow shrink max-w-max
        flex justify-center items-center gap-2
        bg-black rounded-full
        lg:ml-0
      "
      >
        <div class="flex">
          {#each dateRanges as dateRange}
            {@const selected = selectedDateRange?.text === dateRange.text}
            {#if showRanges || selected}
              <DateRangeBtn
                {selected}
                title={dateRange.title}
                on:click={() => {
                  selectedDateRange = dateRange;
                  endDate = new Date();
                  startDate = dateRange.minDate;
                  changeDate();
                }}
              >
                {dateRange.text}
              </DateRangeBtn>
            {/if}
          {/each}
          {#if showRanges || selectedDateRange == null}
            <DateRangeBtn
              selected={selectedDateRange == null}
              title="Custom time-frame"
              on:click={() => {
                selectedDateRange = null;
                showRanges = false;
              }}
            >
              Custom
            </DateRangeBtn>
          {/if}
        </div>
        <button
          class="text-2xl btn p-2 rounded-full aspect-square"
          on:click={() => (showRanges = !showRanges)}
        >
          <Fa
            icon={faCaretLeft}
            class="{showRanges
              ? ''
              : 'rotate-180'} transition-transform duration-500"
          />
        </button>
      </section>
      <div
        class="
        expander w-full px-4
        flex justify-center items-center
        bg-black rounded-full
        row-start-1
      "
      >
        <DoubleSlider
          on:change={() => {
            selectedDateRange = null;
            changeDate();
          }}
          minDate={firstDate}
          {maxDate}
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
