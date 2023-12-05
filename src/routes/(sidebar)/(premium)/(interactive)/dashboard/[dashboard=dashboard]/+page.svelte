<script lang="ts">
  import type { ArticleBase, SearchQuery } from "$shared/types/api";
  import type { PageData } from "./$types";
  import type { Dashboards } from "$shared/types/internal";

  import Loader from "$com/loader.svelte";
  import DateSlider from "./dateSlider.svelte";

  import BoardTitle from "./boards/title/index.svelte";
  import BoardPopular from "./boards/popular/index.svelte";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import { onDestroy, onMount } from "svelte";
  import { toUrl } from "$lib/common/searchQuery";
  import { browser } from "$app/environment";
  import { error } from "@sveltejs/kit";
  import { modalState } from "$shared/state/state";

  export let data: PageData;

  let startDate = new Date(new Date().setDate(new Date().getDate() - 7));

  let articleListContainer: HTMLDivElement | null = null;
  let scrollIntervalID: any = null;
  let hovering: boolean = false;

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
      throw error(r.status);
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

<main class="relative flex w-full p-8 bg-surface-100 dark:bg-surface-800">
  {#await articles}
    <Loader text="Loading articles for dashboard" />
  {:then articleList}
    <svelte:component
      this={dashboards[data.dashboard]}
      on:mouseenter={() => (hovering = true)}
      on:mouseleave={() => (hovering = false)}
      bind:articleListContainer
      {articleList}
      clusters={data.clusters}
    />
    <DateSlider
      bind:date={startDate}
      on:change={() => (articles = fetchArticles())}
    />
  {/await}
</main>
