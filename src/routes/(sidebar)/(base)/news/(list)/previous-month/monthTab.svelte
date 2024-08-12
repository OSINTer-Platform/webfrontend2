<script lang="ts">
  import type { ArticleSearchQuery } from "$shared/types/api";
  import type { Writable } from "svelte/store";

  export let selectedMonth: Writable<{
    name: string;
    id: string;
    query: ArticleSearchQuery;
  }>;
  export let month: { name: string; id: string; query: ArticleSearchQuery };

  $: monthName = month.name.split(" ")[0];
  $: year = month.name.split(" ")[1];

  $: selected = $selectedMonth.id == month.id;
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

	{selected ? '!bg-primary-800 text-white' : ''}
"
>
  <input
    type="radio"
    bind:group={$selectedMonth}
    name="month-selection"
    value={month}
    class="hidden"
  />

  <span
    class="
      text-sm md:text-base
      font-bold dark:font-light
      {selected ? '!font-bold' : ''}
    ">{monthName}</span
  >
  <span
    class="
      text-xs md:text-sm
      font-light dark:font-thin
      {selected ? '!font-light' : ''}
    ">{year}</span
  >
</label>
