<script lang="ts">
  import HeaderShell from "$com/article-list/header/shell.svelte";
  import ClusterListElement from "./clusterListElement.svelte";
  import TopicChart from "./chart/topicChart.svelte";
  import Loader from "$com/loader.svelte";

  import type { PageData } from "./$types";
  import type { HeaderModOptions } from "$shared/types/internal";
  import type { Cluster } from "$shared/types/api";

  import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { searchInCluster } from "$lib/common/filter";
  import { PUBLIC_API_BASE } from "$env/static/public";
  import { slide } from "svelte/transition";

  export let data: PageData;

  let fullClusters: Promise<Cluster[] | null> = Promise.resolve(null);
  let showClusterGraph = false;

  const clusterSearch = writable("");
  $: filteredClusters = data.clusters
    .filter((c) => c.nr >= 0)
    .filter(
      (c) => $clusterSearch.length < 1 || searchInCluster(c, $clusterSearch)
    );

  const modOptions: HeaderModOptions[] = [
    {
      title: "Show cluster development",
      icon: faArrowTrendUp,
      action: () => {
        showClusterGraph = !showClusterGraph;
      },
    },
  ];

  onMount(() => {
    fullClusters = fetch(`${PUBLIC_API_BASE}/ml/clusters?complete=true`).then(
      (r) => {
        if (r.ok) {
          return r.json();
        } else {
          console.error("Error when fetching full clusters for graph");
          return null;
        }
      }
    );
  });
</script>

<div class="overflow-y-auto">
  <HeaderShell
    title={"Topics in OSINTer"}
    description={"Clusters of different articles from OSINTer - each presenting a different topic"}
    searchAble={false}
    {modOptions}
    bind:searchValue={$clusterSearch}
    tabs={null}
  >
    {#if showClusterGraph}
      {#await fullClusters}
        <Loader text="Loading data for graph" />
      {:then clusters}
        {#if clusters}
          <section transition:slide>
            <hr class="text-tertiary-800/50 my-12" />
            <TopicChart {clusters} search={$clusterSearch} />
            <hr class="text-tertiary-800/50 my-12" />
          </section>
        {/if}
      {/await}
    {/if}
  </HeaderShell>

  <main
    class="
    flex flex-col gap-8
    p-4 sm:p-12
  "
  >
    {#each filteredClusters as cluster}
      <ClusterListElement {cluster} />
    {/each}
  </main>
</div>
