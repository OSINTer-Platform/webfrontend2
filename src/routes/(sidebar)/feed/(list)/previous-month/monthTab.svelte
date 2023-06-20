<script lang="ts">
  import type { Writable } from "svelte/store";
  export let currentMonth: Writable<string>;
  export let month: { name: string; id: string; url: URL };

  $: monthName = month.name.split(" ")[0];
  $: year = month.name.split(" ")[1];

  $: selected = $currentMonth == month.id;
</script>

<label
  class="
	flex flex-col
	grow lg:basis-32

	px-4 py-1 md:py-2
	mb-2 md:mb-4

	cursor-pointer

	text-center

	bg-primary-500/10
	hover:bg-primary-500/20

	border-y
	border-primary-800

	dark:text-white

	{selected ? '!bg-primary-800 text-white' : ''}
"
>
  <input
    type="radio"
    bind:group={$currentMonth}
    name="month-selection"
    value={month.id}
    class="hidden"
  />

  <span
    class="text-sm md:text-base font-bold dark:font-light {selected
      ? '!font-bold'
      : ''}">{monthName}</span
  >
  <span
    class="text-xs md:text-sm font-light dark:font-thin {selected
      ? '!font-light'
      : ''}">{year}</span
  >
</label>
