<script lang="ts">
  import Loader from "$com/loader.svelte";
  import Cloud from "./cloud.svelte";

  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { browser } from "$app/environment";
  import { getTags } from "$lib/common/elasticsearch/aggregations";
  import Tagline from "../tagline.svelte";

  let selectedTags: Writable<string[]> = writable([]);
  let mounted = false;
  let hoverText = "";

  const queryTags = (
    selected: string[],
    mounted: boolean
  ): ReturnType<typeof getTags> =>
    mounted
      ? getTags(selected, 50)
      : Promise.resolve({
          tags: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [],
          },
          hitCount: 0,
        });

  $: tags = queryTags($selectedTags, mounted);

  onMount(() => {
    if (!browser) return;
    mounted = true;
  });
</script>

<Tagline keywords={selectedTags} bind:hoverText />

{#await tags}
  <Loader text="Loading tags" />
{:then tags}
  <Cloud bind:hoverText {tags} {selectedTags} />
{/await}
