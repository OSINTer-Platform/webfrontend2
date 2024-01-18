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
    text: b.key,
    size: b.doc_count,
    action: (w) => selectedTags.set([...$selectedTags, w.text]),
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
