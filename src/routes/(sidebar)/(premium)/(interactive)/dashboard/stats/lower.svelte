<script lang="ts">
  import type { SignificantTermAgg } from "$lib/common/elasticsearch/aggregations";
  import TrendChart from "./trendChart/index.svelte";

  export let startDate: Date;
  export let significantTags: SignificantTermAgg;
</script>

<section class="flex flex-col p-4">
  <h3 class="font-bold dark:text-white text-2xl mb-3">Trends in articles</h3>
  <TrendChart
    {startDate}
    keywords={significantTags.buckets.map((b) => b.key).slice(0, 10)}
  />
</section>
<section class="" />
