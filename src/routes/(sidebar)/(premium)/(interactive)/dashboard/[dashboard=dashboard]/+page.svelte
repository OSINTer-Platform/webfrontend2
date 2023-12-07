<script lang="ts">
  import type { ArticleBase, SearchQuery } from "$shared/types/api";
  import type { PageData } from "./$types";
  import type { Dashboards } from "$shared/types/internal";

  import Loader from "$com/loader.svelte";
  import Controls from "./controls/index.svelte";

  import BoardTitle from "./boards/title/index.svelte";
  import BoardPopular from "./boards/popular/index.svelte";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import { onDestroy, onMount } from "svelte";
  import { toUrl } from "$lib/common/searchQuery";
  import { browser } from "$app/environment";
  import { modalState } from "$shared/state/state";

  export let data: PageData;

  let articleListContainer: HTMLDivElement | null = null;
  let scrollIntervalID: any = null;
  let loadRetries = 0;

  let hovering: boolean = false;
  let startDate: Date = new Date(new Date().setDate(new Date().getDate() - 7));

  let articles: Promise<ArticleBase[]> = new Promise((resolve) => resolve([]));

  const dashboards: { [key in Dashboards]: any } = {
    title: BoardTitle,
    popular: BoardPopular,
  };

  function startScroll(container: HTMLElement | null) {
    if (!container) return;

    container.scroll(0, 0);

    if (scrollIntervalID) clearInterval(scrollIntervalID);

    scrollIntervalID = setInterval(() => {
      if (hovering || $modalState.modalType) return;
      container?.scrollTo(0, container.scrollTop + 1);
      if (
        container.scrollTop + container.clientHeight >
        container.scrollHeight - 20
      )
        container.scroll(0, 0);
    }, 20);
  }

  async function fetchArticles(): Promise<ArticleBase[]> {
    const q: SearchQuery = {
      sort_by: "publish_date",
      sort_order: "desc",
      limit: 10000,
      first_date: startDate.toISOString(),
    };

    const r = await fetch(`${PUBLIC_API_BASE}/articles/search?${toUrl(q)}`);

    if (r.ok) {
      return await r.json();
    } else {
      throw Error;
    }
  }

  $: startScroll(articleListContainer);

  onMount(async () => {
    if (!browser) return;
    articles = fetchArticles();
    setTimeout(() => location.reload(), 1000 * 60 * 10);
  });

  onDestroy(() => {
    clearInterval(scrollIntervalID);
  });
</script>

<main
  class="relative flex w-full md:p-4 lg:p-8 bg-surface-100 dark:bg-surface-800"
>
  {#await articles}
    <Loader text="Loading articles for dashboard" />
  {:then articleList}
    <svelte:component
      this={dashboards[data.dashboard]}
      on:mouseenter={() => (hovering = true)}
      on:mouseleave={() => (hovering = false)}
      bind:articleListContainer
      {articleList}
    />
    <Controls bind:startDate on:change={() => (articles = fetchArticles())} />
  {:catch}
    <div
      class="
      h-full mx-auto px-8
      xl:max-w-5xl max-w-2xl
      flex flex-col
      justify-center items-center text-center
      dark:text-white"
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
          articles = fetchArticles();
        }}>Try again ({loadRetries})</button
      >
    </div>
  {/await}
</main>
