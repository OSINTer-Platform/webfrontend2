<script lang="ts">
  import type { PageServerData } from "./$types";
  export let data: PageServerData;

  import InternalLinks from "$com/frontpage/internalLinks.svelte";
  import Blogposts from "$com/frontpage/blogposts.svelte";
  import Faq from "$com/frontpage/faq.svelte";
  import Header from "$com/frontpage/header.svelte";
  import Topbar from "./topbar.svelte";

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
  {scrollY > 0
    ? 'backdrop-blur-xl bg-white/50 dark:bg-black/50'
    : 'backdrop-filter-none dark:bg-black/20'}
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
		w-full

		bg-surface-300
		dark:bg-black
	"
  >
    <Header {mouse} />
  </header>
  <section class="bg-surface-100 dark:bg-surface-900">
    <div class="container p-4 sm:p-8 lg:p-12 xl:py-20">
      <!--
      <div
        class="
				p-4

				flex
				items-center
				gap-8

				md:text-lg
				font-medium
				bg-primary-400/20
				border-4
				border-primary-800/20

				dark:text-white/75
			"
      >
        <Fa icon={faExclamationCircle} class="text-3xl text-primary-800" />
        Do keep in mind that this OSINTer instance is for testing and development,
        and stability may vary.
      </div>

      <hr class="border-surface-200 dark:border-surface-700" />
      -->

      <InternalLinks />

      <hr class="border-surface-200 dark:border-surface-700" />

      <Blogposts posts={data.posts} />
    </div>
  </section>

  <section class="bg-surface-200 dark:bg-surface-800">
    <div
      class="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto p-10 sm:py-20"
    >
      <Faq />
    </div>
  </section>
</div>

<style lang="postcss">
  hr {
    @apply text-surface-400/10 border-2 my-6 sm:my-10 md:my-14 lg:my-16;
  }

  section {
    @apply w-full;
  }

  div {
    :global(div.container) {
      @apply xl:max-w-7xl mx-auto;
    }
  }
</style>
