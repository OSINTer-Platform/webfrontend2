<script lang="ts">
  import type { LayoutData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";

  import HeaderShell from "$com/itemList/header/shell.svelte";
  import MonthTab from "./monthTab.svelte";

  import { feedLocalSearch } from "$state/state";
  import { faDownload } from "@fortawesome/free-solid-svg-icons/index";

  export let data: LayoutData;
  const currentMonthId = data.currentMonth;
  $: currentMonth = data.monthLookup[$currentMonthId];

  let modOptions: Array<HeaderModOptions>;

  $: modOptions = [
    {
      title: "Download",
      icon: faDownload,
      route: `${currentMonth.url.origin}${currentMonth.url.pathname}/export${currentMonth.url.search}`,
      options: {
        download: "true",
      },
    },
  ];
</script>

<HeaderShell
  title={"Previous month"}
  badge={"Inbuilt feed"}
  description={`All the new available from the month of`}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
>
  <hr class="border-tertiary-600/50 my-4" />

  <div class="flex flex-wrap">
    {#each data.months as month}
      <MonthTab {month} currentMonth={currentMonthId} />
    {/each}
  </div>

  <hr class="border-tertiary-600/50 mb-4" />
</HeaderShell>

<slot />
