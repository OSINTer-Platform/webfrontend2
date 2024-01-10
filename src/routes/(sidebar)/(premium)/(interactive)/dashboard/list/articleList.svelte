<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import type { Dashboards } from "./common";

  import { onDestroy, onMount } from "svelte";
  import { modalState } from "$state/modals";

  import BoardTitle from "./boards/title/index.svelte";

  export let articles: ArticleBase[];
  export let dashboard: Dashboards;
  export let fetchArticles: () => Promise<ArticleBase[]>;
  export let scrollSpeed: number;

  let articleListContainer: HTMLDivElement | null = null;
  let hovering: boolean = false;

  let articleQueryIntervalId: ReturnType<typeof setTimeout> | undefined =
    undefined;
  let scrollIntervalId: undefined | number = undefined;

  const dashboards: { [key in Dashboards]: any } = {
    title: BoardTitle,
  };

  function startScroll(container: HTMLElement | null) {
    if (scrollIntervalId) cancelAnimationFrame(scrollIntervalId);
    if (!container) return;
    container.scroll(0, 0);

    let start: DOMHighResTimeStamp = performance.now();

    function end(container: HTMLElement) {
      scrollIntervalId = requestAnimationFrame((t) => scroll(container, t));
    }

    function scroll(container: HTMLElement, timestamp: DOMHighResTimeStamp) {
      if (!hovering && $modalState.length === 0) {
        const scrollLength = ((timestamp - start) / 20) * scrollSpeed;

        if (scrollLength < 1) {
          end(container);
          return;
        }
        container.scrollBy({ top: scrollLength });

        if (
          container.scrollTop + container.clientHeight >
          container.scrollHeight - 20
        ) {
          container.scroll(0, 0);
        }
      }

      start = timestamp;
      end(container);
    }

    end(container);
  }

  async function updateArticleList() {
    try {
      const newArticles = await fetchArticles();
      articles = newArticles;
    } catch {
      console.error("Error when querying new articles");
    }
  }

  $: startScroll(articleListContainer);

  onMount(() => {
    // Query new articles every 10 minutes
    articleQueryIntervalId = setInterval(updateArticleList, 1000 * 60 * 10);
  });

  onDestroy(() => {
    clearInterval(articleQueryIntervalId);
    clearInterval(scrollIntervalId);
  });
</script>

<svelte:component
  this={dashboards[dashboard]}
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  bind:articleListContainer
  {articles}
/>
