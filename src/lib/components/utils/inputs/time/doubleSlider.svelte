<script lang="ts">
  import DoubleSlider from "../doubleSlider/index.svelte";

  import { firstDate as globalFirstDate } from "$shared/config";
  import { getReadableDate } from "$lib/common/math";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{
    change: { firstDate: Date; lastDate: Date };
  }>();

  export let config:
    | {
        hoverTitles?: boolean;
        rounded?: boolean;
        backgroundColor?: string;
        foregroundColor?: string;
      }
    | undefined = undefined;

  export let minDate: Date = globalFirstDate;
  export let maxDate: Date = new Date();

  export let firstDate: Date;
  export let lastDate: Date;

  const formatNumber = (n: number) => getReadableDate(new Date(n));

  let internalFirstValue: number;
  let internalLastValue: number;

  const firstInput = (d: Date) => (internalFirstValue = d.getTime());
  const lastInput = (d: Date) => (internalLastValue = d.getTime());

  const firstOutput = (n: number) => (firstDate = new Date(n));
  const lastOutput = (n: number) => (lastDate = new Date(n));

  $: firstInput(firstDate);
  $: lastInput(lastDate);

  $: firstOutput(internalFirstValue);
  $: lastOutput(internalLastValue);

  const change = () => dispatch("change", { firstDate, lastDate });
</script>

<DoubleSlider
  {config}
  minValue={minDate.getTime()}
  maxValue={maxDate.getTime()}
  bind:firstValue={internalFirstValue}
  bind:lastValue={internalLastValue}
  stepSize={1000 * 60 * 60 * 24}
  {formatNumber}
  on:change={change}
/>
