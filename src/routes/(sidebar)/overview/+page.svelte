<script lang="ts">
  import { browser } from "$app/environment";
  import Loader from "$com/loader.svelte";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import type { MLArticle } from "$shared/types/api";
  import { onMount } from "svelte";
  import Map from "./map.svelte";
  import ControlPanel from "./controlPanel.svelte";
  import {
    derived,
    writable,
    type Readable,
    type Writable,
  } from "svelte/store";

  let mapData: Readable<Promise<MLArticle[]>>;
  let mounted = false;

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

  async function queryArticles(complete: boolean): Promise<MLArticle[]> {
    const r = await fetch(
      `${PUBLIC_API_BASE}/ml/articles/map/${complete ? "full" : "partial"}`
    );
    if (!r.ok) return Promise.reject("Could not load data");

    const articles: MLArticle[] = await r.json();
    return sanitizeArticleList(articles);
  }

  onMount(() => {
    if (browser) {
      mapData = derived(deepSearch, ($deepSearch) =>
        queryArticles($deepSearch)
      );
      mounted = true;
    }
  });

  let mapHeight;
  let mapWidth;
  // Controlpanel variables
  let size = 1;

  let search = "";
  let deepSearch: Writable<boolean> = writable(false);
</script>

{#if mounted}
  <div
    id="map-container"
    class="w-full h-full"
    bind:clientWidth={mapWidth}
    bind:clientHeight={mapHeight}
  >
    <ControlPanel bind:size bind:deepSearch={$deepSearch} bind:search />
    {#await $mapData}
      <Loader
        text={`Loading articles for generating the map.\nThis might take a while`}
      />
    {:then mapArticles}
      <Map
        mapData={mapArticles}
        {size}
        {search}
        deepSearch={$deepSearch}
        width={mapWidth}
        height={mapHeight}
      />
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
