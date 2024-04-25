<script lang="ts">
  import type { LayoutData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";

  import HeaderShell from "$com/itemList/header/shell.svelte";

  import { feedLocalSearch } from "$state/state";
  import { faDownload } from "@fortawesome/free-solid-svg-icons/index";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { toUrl } from "$lib/common/searchQuery";

  export let data: LayoutData;

  $: searchQuery = data.searchQuery;

  let modOptions: Array<HeaderModOptions>;

  $: modOptions = [
    {
      title: "Download",
      icon: faDownload,
      route: `${PUBLIC_API_BASE}/articles/search/export?${toUrl($searchQuery)}`,
      options: {
        download: "true",
      },
    },
  ];
</script>

<HeaderShell
  title={"Commonly read articles"}
  badge={"Inbuilt feed"}
  description={"Explore the most read articles on this OSINTer instance, and get an insight into what is trending"}
  {modOptions}
  bind:searchValue={$feedLocalSearch}
/>

<slot />
