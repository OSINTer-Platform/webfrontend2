<script lang="ts">
  import * as d3 from "d3";

  import Chart from "$com/charts/linechart/index.svelte";

  import { searchInCluster } from "$lib/common/filter";
  import { goto } from "$app/navigation";

  import type { Cluster } from "$shared/types/api";

  type ClusterWithDate = Omit<Cluster, "dating"> & { dating: number[] };

  export let search: string;
  export let clusters: Cluster[];

  let xDomain: [number, number] = [
    new Date("2022").getTime(),
    new Date().getTime(),
  ];

  let customXAxisScale = d3.scaleTime().domain(xDomain);

  let clustersWithDate: ClusterWithDate[];
  $: clustersWithDate = clusters.map((cluster) => ({
    ...cluster,
    dating: cluster.dating
      .map((date) => new Date(date).getTime())
      .sort((a, b) => a - b),
  }));

  let processedClusters: ClusterWithDate[];
  $: processedClusters =
    search.length > 0
      ? clustersWithDate.filter((c) => searchInCluster(c, search))
      : clustersWithDate;

  $: lines = processedClusters.map((c) => ({
    id: c.id,
    title: c.title,
    points: c.dating.map((d, i) => ({ x: d, y: i + 1 })),
  }));
</script>

<Chart
  {lines}
  {xDomain}
  {customXAxisScale}
  containerClass="w-full h-[30rem] "
  yAxisText="↑ Documents per cluster"
  on:click={(e) => {
    if (e && e.detail?.id) {
      goto(`/topic/${encodeURIComponent(e.detail.id)}`);
    }
  }}
/>
