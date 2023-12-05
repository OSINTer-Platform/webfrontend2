<script lang="ts">
  import type { ArticleBase, ClusterBase } from "$shared/types/api";

  export let articles: ArticleBase[];
  export let clusters: ClusterBase[];

  $: clusterTable = Object.fromEntries(
    clusters.map((cluster) => [cluster.id, cluster])
  );

  $: clusterCount = articles.reduce(
    (accumulator: { [key: string]: number }, article) => {
      if (!article.ml?.cluster || article.ml.cluster.length < 1)
        return accumulator;

      const clusterId = article.ml.cluster;

      if (!Object.keys(clusterTable).includes(clusterId)) return accumulator;

      accumulator[clusterId] = (accumulator[clusterId] ?? 0) + 1;

      return accumulator;
    },
    {}
  );

  $: commonClusters = Object.entries(clusterCount)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 3)
    .map(([clusterId, count]) => ({ cluster: clusterTable[clusterId], count }));
</script>

<h2 class="text-2xl font-bold dark:text-white mb-2">Common topics:</h2>

<ul class="flex flex-col shrink gap-4 overflow-y-scroll">
  {#each commonClusters as { cluster, count }}
    <a
      href="/topic/{encodeURIComponent(cluster.id)}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <li
        class="
          flex justify-between gap-8
          w-full p-4
          border border-primary-500
          dark:text-white leading-6
          truncate

          hover:bg-primary-400/20
        "
      >
        <span class="shrink truncate">{cluster.title}</span>
        <span>{count} articles</span>
      </li>
    </a>
  {/each}
</ul>
