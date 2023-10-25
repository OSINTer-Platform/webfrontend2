<script lang="ts">
  import HeaderShell from "$com/article-list/header/shell.svelte";
  import ClusterListElement from "./clusterListElement.svelte";

  import type { PageData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";

  import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
  import { writable } from "svelte/store";
  import { searchInCluster } from "$lib/common/filter";

  export let data: PageData;

  const clusterSearch = writable("");
  $: clusters = data.clusters
    .filter((c) => c.nr >= 0)
    .filter(
      (c) => $clusterSearch.length < 1 || searchInCluster(c, $clusterSearch)
    );

  const modOptions: HeaderModOptions[] = [
    {
      title: "Show cluster development",
      icon: faArrowTrendUp,
      action: () => {},
    },
  ];
</script>

<HeaderShell
  title={"Topics in OSINTer"}
  description={"Clusters of different articles from OSINTer - each presenting a different topic"}
  {modOptions}
  bind:searchValue={$clusterSearch}
  tabs={null}
/>

<main
  class="
  flex flex-col gap-8
  p-4 sm:p-12
  overflow-y-auto
"
>
  {#each clusters as cluster}
    <ClusterListElement {cluster} />
  {/each}
</main>
