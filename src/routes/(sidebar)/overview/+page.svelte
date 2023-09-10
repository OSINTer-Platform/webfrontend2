<script lang="ts">
  import type { MLArticle } from "$shared/types/api";
  import type { Readable } from "svelte/store";

  import { derived, readable } from "svelte/store";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { controlParams, mapDimensions } from "./state";

  import { PUBLIC_API_BASE } from "$env/static/public";

  import Loader from "$com/loader.svelte";
  import SelectionPanel from "./selectionPanel.svelte";
  import ControlPanel from "./controlPanel.svelte";
  import Map from "./map.svelte";

  let mapData: Readable<Promise<Readable<MLArticle[]>>>;

  let readyToMount = false;
  let incompatibleDevice = false;

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
      const touchScreen =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        ("msMaxTouchPoints" in navigator &&
          typeof navigator.msMaxTouchPoints === "number" &&
          navigator.msMaxTouchPoints > 0);

      if (touchScreen || window.innerWidth < 1200 || window.innerHeight < 700)
        incompatibleDevice = true;

      mapData = derived(deepSearch, ($deepSearch) =>
        queryArticles($deepSearch)
      );

      readyToMount = true;
    }
  });
</script>

<div
  id="map-container"
  class="w-full h-full bg-surface-100 dark:bg-surface-800"
  bind:clientWidth={$mapDimensions.width}
  bind:clientHeight={$mapDimensions.height}
>
  {#if incompatibleDevice}
    <div
      class="h-full mx-auto px-8 xl:max-w-5xl max-w-2xl flex flex-col justify-center items-center text-center dark:text-white"
    >
      <h2
        class="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold md:mb-2"
      >
        It doesn't seem your devices is compatible.
      </h2>
      <p
        class="xl:text-2xl md:text-xl sm:text-lg font-light md:tracking-tighter mb-8"
      >
        Unfortunately, this page doesn't support small screens or touch-devices.
      </p>
      <button
        class="btn p-2 w-48 lg:p-4 lg:w-64 lg:text-xl font-bold
        text-primary-600 dark:text-primary-600 dark:hover:text-primary-500
        border-2 border-primary-600 dark:border-primary-500
        "
        on:click={() => (incompatibleDevice = false)}>Continue anyway</button
      >
    </div>
  {:else if readyToMount}
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
  {:else}
    <div
      class="h-full mx-auto px-8 xl:max-w-5xl max-w-2xl flex flex-col justify-center text-center dark:text-white"
    >
      <h2
        class="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold md:mb-2"
      >
        Javascript has to be enabled
      </h2>
      <p
        class="xl:text-2xl md:text-xl sm:text-lg font-light md:tracking-tighter"
      >
        It doesn't seem like Javascript is enabled - or something is interfering
        with it. Please turn Javascript back on to use this page.
      </p>
    </div>
  {/if}
</div>
