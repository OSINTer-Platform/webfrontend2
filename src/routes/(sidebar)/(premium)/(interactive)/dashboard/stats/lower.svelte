<script lang="ts">
  import { writable } from "svelte/store";
  import TrendChart from "./trendChart/index.svelte";
  import type {
    SignificantTermAgg,
    TermAgg,
  } from "$lib/common/elasticsearch/aggregations";

  export let startDate: Date;
  export let significantTags: SignificantTermAgg;
  export let cves: TermAgg;
  export let tags: TermAgg;

  const initialKeywordCount = 10;

  const keywords = writable(
    significantTags.buckets.map((b) => b.key).slice(0, initialKeywordCount)
  );
</script>

<section class="flex flex-col p-4">
  <h3 class="font-bold dark:text-white text-2xl mb-3">Trends in articles</h3>
  <TrendChart {startDate} {keywords} />
</section>
<section class="" />
