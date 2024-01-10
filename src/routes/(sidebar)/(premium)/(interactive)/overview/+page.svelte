<script lang="ts">
  import type { PageData } from "./$types";
  import type { MLArticle, ArticleML } from "$shared/types/api";
  import type { Readable } from "svelte/store";

  import { derived, readable, writable } from "svelte/store";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { controlParams, mapDimensions } from "./state";
  import { config } from "$shared/config";
  import { searchArticles } from "$lib/common/elasticsearch/search";

  import Loader from "$com/loader.svelte";
  import Panels from "./panels/index.svelte";
  import Map from "./map.svelte";

  export let data: PageData;

  let mapData: Readable<Promise<Readable<MLArticle[]>>>;

  let readyToMount = false;
  let incompatibleDevice = false;
  let retries = writable(0);

  const { deepSearch } = controlParams;

  type MLUndefined = Omit<MLArticle, "ml"> & { ml?: ArticleML };

  function containsML(article: MLUndefined): article is MLArticle {
    return article.ml !== undefined;
  }

  function sanitizeArticleList(articles: MLUndefined[]): MLArticle[] {
    const completeArticles: MLArticle[] = [];

    articles.forEach((a) => {
      if (
        containsML(a) &&
        a.ml.coordinates &&
        a.ml.coordinates[0] != 0 &&
        a.ml.coordinates[1] != 0
      ) {
        completeArticles.push(a);
      }
    });

    return completeArticles;
  }

  async function queryArticles(complete: boolean) {
    let articles;
    try {
      articles = await searchArticles(
        { limit: 0 },
        {
          include_fields: [
            "title",
            "description",
            "profile",
            "source",
            "ml",
            "publish_date",
          ],
        }
      );
    } catch {
      return Promise.reject({
        title: "Error when fetching data for map",
        description:
          "It seems the network is at fault. Contact the system administrator if error persists",
      });
    }

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

      mapData = derived([deepSearch, retries], ([$deepSearch, _]) =>
        queryArticles($deepSearch)
      );

      readyToMount = true;
    }
  });
</script>

<svelte:head>
  <title>OSINTer - Overview</title>
  <meta property="og:title" content="OSINTer - Use ML to map articles" />
  <meta
    property="og:description"
    content="The overview in OSINTer uses advanced unsupervised machine-learning to cluster articles for easy viewing"
  />
  <meta property="og:image" content={config.images.fullLogo} />
  <meta property="og:url" content="https://osinter.dk/overview" />
  <meta property="og:type" content="website" />
</svelte:head>

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
    <Panels
      articleCategories={data.sourceCategories}
      clusters={data.clusters}
    />
    {#await $mapData}
      <Loader
        text={`Loading articles for generating the map.\nThis might take a while`}
      />
    {:then articles}
      <Map {articles} clusters={data.clusters} />
    {:catch error}
      <div
        class="h-full mx-auto px-8 xl:max-w-5xl max-w-2xl flex flex-col justify-center items-center text-center dark:text-white"
      >
        <h2
          class="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold md:mb-2"
        >
          {error.title ?? "Error when loading overview."}
        </h2>
        <p
          class="xl:text-2xl md:text-xl sm:text-lg font-light md:tracking-tighter mb-8"
        >
          {error.description ??
            "An unknown error occurred when attempting to load the overview"}
        </p>
        <button
          class="btn p-2 w-48 lg:p-4 lg:w-64 lg:text-xl font-bold
        text-primary-600 dark:text-primary-600 dark:hover:text-primary-500
        border-2 border-primary-600 dark:border-primary-500
        "
          on:click={() => retries.update((r) => r + 1)}
          >Try again ({$retries})</button
        >
      </div>
    {/await}
  {/if}
</div>
