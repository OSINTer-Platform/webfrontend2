<script lang="ts">
  import type { MLArticle } from "$shared/types/api";

  import {
    derived,
    writable,
    type Readable,
    type Writable,
    readable,
  } from "svelte/store";

  import { controlParams, mapDimensions } from "./state";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { PUBLIC_API_BASE } from "$env/static/public";

  import Loader from "$com/loader.svelte";
  import Map from "./map.svelte";
  import ControlPanel from "./controlPanel.svelte";
  import SelectionPanel from "./selectionPanel.svelte";

  let mapData: Readable<Promise<Readable<MLArticle[]>>>;

  let mounted = false;

  const { deepSearch } = controlParams;

  function sanitizeArticleList<PartialArticle extends MLArticle>(
    articles: PartialArticle[]
  ): PartialArticle[] {
    const completeArticles: PartialArticle[] = [];

    articles.forEach((a) => {
      if (
        a.ml.coordinates &&
        a.ml.coordinates[0] != 0 &&
        a.ml.coordinates[1] != 0
      ) {
        completeArticles.push(a);
      }
    });

    return completeArticles;
  }

  async function queryArticles(
    complete: boolean
  ): Promise<Readable<MLArticle[]>> {
    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/articles/map/${complete ? "full" : "partial"}`
    );
    if (!r.ok) return Promise.reject("Could not load data");

    const articles: MLArticle[] = await r.json();
    return readable(sanitizeArticleList(articles));
  }

  onMount(() => {
    if (browser) {
      mounted = false;
      mapData = derived(deepSearch, ($deepSearch) =>
        queryArticles($deepSearch)
      );

      mounted = true;
    }
  });
</script>

{#if mounted}
  <div
    id="map-container"
    class="w-full h-full bg-surface-100 dark:bg-surface-800"
    bind:clientWidth={$mapDimensions.width}
    bind:clientHeight={$mapDimensions.height}
  >
    <ControlPanel />
    <SelectionPanel />
    {#await $mapData}
      <Loader
        text={`Loading articles for generating the map.\nThis might take a while`}
      />
    {:then articles}
      <Map {articles} />
    {:catch}
      <div
        class="h-full mx-auto px-8 xl:max-w-5xl max-w-2xl flex flex-col justify-center text-center dark:text-white"
      >
        <h2
          class="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold md:mb-2"
        >
          Error when fetching data for map
        </h2>
        <p
          class="xl:text-2xl md:text-xl sm:text-lg font-light md:tracking-tighter"
        >
          Please try again later, or contact the system administrator if error
          persists
        </p>
      </div>
    {/await}
  </div>
{/if}
