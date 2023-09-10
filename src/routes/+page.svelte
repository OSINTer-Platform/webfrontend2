<script lang="ts">
  import type { PageServerData } from "./$types";
  export let data: PageServerData;

  import InternalLinks from "$com/frontpage/internalLinks.svelte";
  import Blogposts from "$com/frontpage/blogposts.svelte";
  import Faq from "$com/frontpage/faq.svelte";
  import Header from "$com/frontpage/header.svelte";

  import Fa from "svelte-fa/src/fa.svelte";

  import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
  import { config } from "$shared/config";
</script>

<svelte:head>
  <title>OSINTer</title>
  <meta property="og:title" content="OSINTer - The one-stop shop for CTI" />
  <meta
    property="og:description"
    content="Helping companies, organisations and individuals tackle the cyber-threats of tomorrow."
  />
  <meta property="og:image" content={config.images.fullLogo} />
  <meta property="og:url" content="https://osinter.dk/" />
  <meta property="og:type" content="website" />
</svelte:head>

<div class="overflow-y-auto">
  <header
    class="
		w-full

		bg-surface-300
		dark:bg-surface-700
	"
  >
    <Header />
  </header>
  <section class="bg-surface-100 dark:bg-surface-900">
    <div class="container p-4 sm:p-8 lg:p-12 xl:py-20">
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

				rounded-md
				dark:text-white/75
			"
      >
        <Fa icon={faExclamationCircle} class="text-3xl text-primary-800" />
        Do keep in mind that this OSINTer instance is for testing and development,
        and stability may vary.
      </div>

      <hr />

      <InternalLinks />

      <hr />

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
