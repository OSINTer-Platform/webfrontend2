<script lang="ts">
  import type { PageData } from "./$types";
  export let data: PageData;

  import InternalLinks from "$com/frontpage/internalLinks.svelte";
  import Faq from "$com/frontpage/faq.svelte";
  import Header from "$com/frontpage/header.svelte";
  import Topbar from "./topbar.svelte";
  import Cves from "$com/frontpage/cves/index.svelte";
  import Prices from "$com/frontpage/prices/index.svelte";

  let scrollY = 0;

  let mouse: null | { x: number; y: number } = null;

  function scroll(e: any) {
    scrollY = e.target.scrollTop;
  }
</script>

<svelte:window
  on:mousemove={(e) => (mouse = { x: e.x, y: e.y })}
  on:mouseleave={() => (mouse = null)}
/>

<aside
  class="
  z-30 absolute w-full
  bg-surface-100
  {scrollY > 0
    ? 'dark:backdrop-blur-xl dark:bg-black/50'
    : 'dark:backdrop-filter-none dark:bg-black/20'}
  transition-colors duration-200
  shadow-lg
"
>
  <div class="max-w-7xl mx-auto py-2">
    <Topbar />
  </div>
</aside>

<div class="overflow-y-auto" on:scroll={scroll}>
  <header
    class="
      hero w-full

      bg-surface-100
      dark:bg-black
	"
  >
    <Header {mouse} trendingArticles={data.trendingArticles} />
  </header>
  <section
    class="bg-surface-100 dark:bg-surface-900 p-4 sm:p-8 lg:p-12 xl:py-20"
  >
    <div class="container">
      <InternalLinks />
      <hr />
    </div>
    <div class="max-w-7xl mx-auto">
      <header class="text-center mb-12">
        <h2 class="text-4xl sm:text-6xl font-bold">Looking for more?</h2>
        <p class="sm:text-xl font-light">
          Let us help you track the cyber-threat landscape
        </p>
      </header>
      <Prices basePrice={data.basePrice} proPrice={data.proPrice} />
    </div>
  </section>
  <section class="bg-surface-200 dark:bg-surface-800">
    <div class="container p-4 sm:p-8 lg:p-12 xl:py-20">
      <header class="text-right mb-4">
        <h2 class="text-4xl sm:text-6xl font-bold">Trending CVE's</h2>
        <p class="sm:text-xl font-light">
          Track their ever-evolving media presence
        </p>
      </header>
      <Cves cves={data.trendingCVEs} />
    </div>
  </section>

  <section class="bg-surface-100 dark:bg-surface-900">
    <div
      class="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto p-10 sm:py-20"
    >
      <Faq />
    </div>
  </section>
</div>

<style lang="postcss">
  hr {
    @apply border-surface-400/30 border-2 my-6 sm:my-10 md:my-14 lg:my-16;
  }

  section {
    @apply w-full;
  }

  div {
    :global(div.container) {
      @apply xl:max-w-7xl mx-auto;
    }
  }

  /* prettier-ignore */
  header.hero {
    background-image:
      radial-gradient(at 0% 0%, theme(colors.secondary.500 / 30%) 0px,transparent 50%),
      radial-gradient(at 98% 1%, theme(colors.primary.500 / 20%) 0px,transparent 50%);
    &:is(.dark *) {
      background-image: none;
    }
  }
</style>
