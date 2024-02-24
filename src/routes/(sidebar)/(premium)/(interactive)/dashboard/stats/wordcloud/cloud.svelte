<script lang="ts">
  import Wordcloud from "$com/charts/wordcloud/index.svelte";

  import type { CloudWord } from "$com/charts/wordcloud/common";
  import type { TermAgg } from "$lib/common/elasticsearch/aggregations";
  import type { Writable } from "svelte/store";
  import { onDestroy } from "svelte";

  export let tags: { tags: TermAgg; hitCount: number };
  export let selectedTags: Writable<string[]>;
  export let hoverText: string;

  let words: CloudWord[];
  $: words = tags.tags.buckets.map((b) => ({
    text: `${b.key[0].toUpperCase()}${b.key.slice(1)}`,
    size: b.doc_count,
    action: () => selectedTags.set([...$selectedTags, b.key]),
  }));

  onDestroy(() => {
    hoverText = "";
  });
</script>

<Wordcloud
  containerClass="h-full"
  {words}
  bind:hoverText
  options={{ size: 12 }}
/>
