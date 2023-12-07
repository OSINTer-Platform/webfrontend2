<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import type { Dashboards } from "$shared/types/internal";

  import { onDestroy } from "svelte";
  import { modalState } from "$shared/state/state";

  import BoardTitle from "./boards/title/index.svelte";
  import BoardPopular from "./boards/popular/index.svelte";

  export let articles: ArticleBase[];
  export let dashboard: Dashboards;

  let articleListContainer: HTMLDivElement | null = null;
  let scrollIntervalID: any = null;
  let hovering: boolean = false;

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

  $: startScroll(articleListContainer);

  onDestroy(() => {
    clearInterval(scrollIntervalID);
  });
</script>

<svelte:component
  this={dashboards[dashboard]}
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
  bind:articleListContainer
  {articles}
/>
