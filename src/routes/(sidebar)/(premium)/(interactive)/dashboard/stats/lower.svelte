<script lang="ts">
  import { writable } from "svelte/store";

  import TrendChart from "./trendChart/index.svelte";
  import Wordcloud from "./wordcloud/index.svelte";
  import Fa from "svelte-fa";

  import type {
    SignificantTermAgg,
    TermAgg,
  } from "$lib/common/elasticsearch/aggregations";
  import {
    faArrowTrendUp,
    faBug,
    faRankingStar,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons";

  export let startDate: Date;

  export let significantTags: SignificantTermAgg;
  export let cves: TermAgg;
  export let globalTags: TermAgg;

  const initialKeywordCount = 10;

  const keywords = writable(
    significantTags.buckets.map((b) => b.key).slice(0, initialKeywordCount)
  );

  let trendOptions: {
    title: string;
    icon: IconDefinition;
    words: string[];
  }[];

  $: trendOptions = [
    {
      title: "CVE's",
      icon: faBug,
      words: cves.buckets.map((b) => b.key).slice(0, initialKeywordCount),
    },
    {
      title: "Emerging tags",
      icon: faArrowTrendUp,
      words: significantTags.buckets
        .map((b) => b.key)
        .slice(0, initialKeywordCount),
    },
    {
      title: "Popular tags",
      icon: faRankingStar,
      words: globalTags.buckets.map((b) => b.key).slice(0, initialKeywordCount),
    },
  ];
</script>

<section class="flex flex-col py-2 px-6">
  <header class="flex justify-between">
    <h3 class="font-bold text-2xl mt-1 mb-1">Trends in articles</h3>
    <div class="flex gap-2 pb-2">
      {#each trendOptions as { title, icon, words }}
        {@const active = words.join("") === $keywords.join("")}
        <button
          title="Add {title} to chart"
          on:click={() => keywords.set(words)}
          class="
            px-4 btn text-sm
            border border-primary-500
            {active
            ? '!bg-primary-500/40 hover:!bg-primary-400/50'
            : '!text-primary-500'}
        "><Fa {icon} /></button
        >
      {/each}
    </div>
  </header>
  <TrendChart {startDate} {keywords} />
</section>

<section class="flex flex-col py-2 px-6">
  <h3 class="font-bold text-2xl mb-1">Common article tags</h3>
  <Wordcloud {startDate} />
</section>
