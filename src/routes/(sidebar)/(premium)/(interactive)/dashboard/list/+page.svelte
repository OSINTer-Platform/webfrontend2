<script lang="ts">
  import type { ArticleBase, ArticleSearchQuery } from "$shared/types/api";
  import type { PageData } from "./$types";

  import Loader from "$com/loader.svelte";
  import Controls from "./controls/index.svelte";
  import ArticleList from "./articleList.svelte";

  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { queryArticles } from "$lib/common/queryArticles";

  export let data: PageData;

  let loadRetries = 0;
  let articleQuery: Promise<ArticleBase[]> = new Promise((resolve) =>
    resolve([])
  );
  let scrollSpeed = 1;

  async function fetchArticles(
    firstDate: Date | undefined = undefined,
    lastDate: Date | undefined = undefined
  ): Promise<ArticleBase[]> {
    const q: ArticleSearchQuery = {
      sort_by: "publish_date",
      sort_order: "desc",
      limit: 10000,
      first_date: (firstDate ?? data.startDate).toISOString(),
      last_date: (lastDate ?? data.endDate).toISOString(),
    };

    const articleQuery = await queryArticles(q);
    if (!articleQuery.documents) throw Error;
    else return articleQuery.documents;
  }

  onMount(async () => {
    if (!browser) return;
    articleQuery = fetchArticles();
  });
</script>

<main
  class="relative flex w-full md:p-4 lg:p-8 bg-surface-100 dark:bg-surface-800"
>
  {#await articleQuery}
    <Loader text="Loading articles for dashboard" />
  {:then articles}
    <ArticleList {articles} dashboard="title" {fetchArticles} {scrollSpeed} />
    <Controls
      bind:scrollSpeed
      startDate={data.startDate}
      endDate={data.endDate}
      on:date={(e) => {
        articleQuery = fetchArticles(e.detail.startDate, e.detail.endDate);
      }}
    />
  {:catch}
    <div
      class="
      h-full mx-auto px-8
      xl:max-w-5xl max-w-2xl
      flex flex-col
      justify-center items-center text-center"
    >
      <h2
        class="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold md:mb-2"
      >
        Error when loading overview.
      </h2>
      <p
        class="xl:text-2xl md:text-xl sm:text-lg font-light md:tracking-tighter mb-8"
      >
        An unknown error occurred when attempting to load the overview
      </p>
      <button
        class="btn p-2 w-48 lg:p-4 lg:w-64 lg:text-xl font-bold
        text-primary-600 dark:text-primary-600 dark:hover:text-primary-500
        border-2 border-primary-600 dark:border-primary-500
        "
        on:click={() => {
          loadRetries += 1;
          articleQuery = fetchArticles();
        }}>Try again ({loadRetries})</button
      >
    </div>
  {/await}
</main>
