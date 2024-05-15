<script lang="ts">
  import Loader from "$com/loader.svelte";
  import Cloud from "./cloud.svelte";
  import Tagline from "../tagline.svelte";

  import { onMount } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { browser } from "$app/environment";
  import { getTags } from "$lib/common/elasticsearch/aggregations";
  import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
  import { getBaseArticles } from "$lib/common/elasticsearch/search";
  import { modalState } from "$shared/state/modals";

  let selectedTags: Writable<string[]> = writable([]);
  let mounted = false;
  let hoverText = "";
  let totalHits = 0;

  export let startDate: Date;

  const queryTags = (
    startDate: Date,
    selected: string[],
    mounted: boolean
  ): ReturnType<typeof getTags> =>
    mounted
      ? getTags(startDate, selected, 50)
      : Promise.resolve({
          tags: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [],
          },
          hitCount: 0,
        });

  $: tags = queryTags(startDate, $selectedTags, mounted).then((response) => {
    totalHits = response.hitCount;
    return response;
  });

  function showArticles() {
    const articles = getBaseArticles(
      { limit: 0 },
      {
        filters: $selectedTags.map((tag) => ({
          term: { "tags.automatic": tag },
        })),
      }
    );

    modalState.append({
      modalType: "article-list",
      modalContent: {
        articles,
      },
    });
  }

  onMount(() => {
    if (!browser) return;
    mounted = true;
  });

  const tagProcessor = (w: string) => w.toLowerCase();
</script>

<Tagline
  keywords={selectedTags}
  bind:hoverText
  {tagProcessor}
  buttons={[
    {
      title: `Show ${totalHits} articles`,
      content: `${totalHits} articles`,
      icon: faMagnifyingGlass,
      action: showArticles,
    },
  ]}
/>

{#await tags}
  <Loader text="Loading tags" />
{:then tags}
  <Cloud bind:hoverText {tags} {selectedTags} />
{/await}
