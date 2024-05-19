<script lang="ts">
  import BoxRadios from "$com/utils/inputs/boxRadios.svelte";
  import TimeSlider from "$com/utils/inputs/time/doubleSlider.svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{
    change: { firstDate: Date | null; lastDate: Date | null; selected: string };
  }>();

  type Range = {
    id: string;
    title: string;
    days: number;
  };

  export let firstDate: Date | null;
  export let lastDate: Date | null;
  export let selected: string;
  export let name: string;

  const daySeconds = 24 * 60 * 60 * 1000;

  export let defaultRanges: Range[] = [
    { title: "Last day", id: "day", days: 1 },
    { title: "Last week", id: "week", days: 7 },
    { title: "Last month", id: "month", days: 30 },
    { title: "Last year", id: "year", days: 360 },
  ];

  let radioOptions: { text: string; value: string }[];
  $: radioOptions = [
    ...defaultRanges.map(({ title, id }) => ({ text: title, value: id })),
    { text: "All time", value: "all" },
    { text: "Custom range", value: "custom" },
  ];

  const dispatchChange = (
    first: Date | undefined = undefined,
    last: Date | undefined = undefined
  ) =>
    dispatch("change", {
      firstDate: first ?? firstDate,
      lastDate: last ?? lastDate,
      selected,
    });

  function handleRadioChange(
    e: CustomEvent<{
      selected: string;
    }>
  ) {
    const selected = e.detail.selected;
    if (selected === "all") {
      firstDate = null;
      lastDate = null;
    } else {
      const selectedRange = defaultRanges.find(({ id }) => id === selected);

      if (selectedRange) {
        lastDate = null;
        firstDate = new Date(
          new Date().getTime() - daySeconds * selectedRange.days
        );
      }
    }

    dispatchChange();
  }
</script>

<aside>
  <section class="flex gap-4 flex-wrap mb-4">
    <BoxRadios
      {name}
      options={radioOptions}
      bind:selected
      on:change={handleRadioChange}
    />
  </section>

  {#if selected === "custom"}
    <TimeSlider
      bind:firstDate
      bind:lastDate
      on:change={(e) => dispatchChange(e.detail.firstDate, e.detail.lastDate)}
    />
  {/if}
</aside>
