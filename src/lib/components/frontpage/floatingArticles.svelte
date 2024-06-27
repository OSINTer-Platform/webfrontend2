<script lang="ts">
  import ModalLink from "$com/modalLink.svelte";
  import SmallLogo from "$assets/smallLogo.jpg";

  import { typewriter } from "$lib/common/transitions";
  import { onMount } from "svelte";

  import type { TrendingArticleBundle } from "./types";
  import { fade } from "svelte/transition";
  import SvelteMarkdown from "svelte-markdown";
  import { eclipseConcat } from "$lib/common/strings";

  const holders: {
    top: number;
    left: number;
    animation: { delay: number; duration: number };
  }[] = [
    { top: 10, left: 60, animation: { delay: 1, duration: 6 } },
    { top: 20, left: 20, animation: { delay: 2, duration: 8 } },
    { top: 40, left: 90, animation: { delay: 0, duration: 7 } },
    { top: 60, left: 10, animation: { delay: 1, duration: 9 } },
    { top: 80, left: 80, animation: { delay: 3, duration: 8 } },
    { top: 90, left: 40, animation: { delay: 2, duration: 6 } },
  ];

  export let trendingArticles: TrendingArticleBundle[];

  let selectedBundleIndex = 0;

  $: selectedBundle = trendingArticles[selectedBundleIndex];

  onMount(() =>
    setInterval(
      () =>
        (selectedBundleIndex =
          (selectedBundleIndex + 1) % trendingArticles.length),
      10000
    )
  );
</script>

<section class="relative hidden sm:block lg:scale-75 xl:scale-100">
  <div
    class="
    circle w-[30rem] flex justify-center items-center
    bg-white/20 dark:bg-black
    shadow-2xl
  "
  >
    <div
      class="
      circle w-[18rem] bg-white/30 dark:bg-black
      shadow-xl
    "
    />
  </div>

  <div
    class="
      w-60
      absolute top-1/2 left-1/2
      -translate-x-1/2 -translate-y-1/2
    "
  >
    <p class="font-light text-primary-500 text-lg">Trending topic</p>
    <div class="min-h-7 w-full">
      {#key selectedBundle}
        <h4
          class="font-bold text-3xl leading-7 uppercase break-words"
          in:typewriter={{ duration: 1000, delay: 1000 }}
          out:typewriter={{ duration: 1000 }}
        >
          {selectedBundle.tag}
        </h4>
      {/key}
    </div>
    <p
      class="italic font-light text-sm grid grid-cols-[auto_1fr] gap-[0.15rem]"
    >
      {#key selectedBundle}
        <span
          class="row-start-1 col-start-1"
          out:fade={{ delay: 1000, duration: 500 }}
          in:fade={{ delay: 1500, duration: 500 }}>{selectedBundle.count}</span
        >
      {/key}
      articles
    </p>
  </div>

  {#each holders as { top, left, animation }, i}
    {@const article = selectedBundle.articles[i]}
    <ModalLink
      {article}
      articleList={selectedBundle.articles}
      style="
        top: {top}%; left: {left}%;
        --delay: {animation.delay}s;
        --duration: {animation.duration}s;
      "
      class="
        absolute w-32 h-32
        -translate-x-1/2 -translate-y-1/2
        rounded-md overflow-hidden
        [&:hover>div]:opacity-100
    "
    >
      <img src={SmallLogo} alt="OSINTer logo" />
      {#key article}
        <img
          src={article.image_url}
          alt="Article"
          transition:fade={{ delay: 1000, duration: 1000 }}
          class="text-transparent"
        />
        <div
          transition:fade={{ delay: 1000, duration: 1000 }}
          class="
          absolute z-10 h-full w-full
          flex justify-center items-center text-center
          bg-black/80 opacity-0 transition-opacity duration-300
        "
        >
          <p class="text-white font-bold text-xs">
            {#if article.highlights?.title}
              <SvelteMarkdown
                source={eclipseConcat(article.highlights.title)}
                isInline
              />
            {:else}
              {article.title}
            {/if}
          </p>
        </div>
      {/key}
    </ModalLink>
  {/each}
</section>

<style lang="postcss">
  .circle {
    @apply aspect-square rounded-full
    border border-gray-900 dark:border-gray-900
    outline outline-1 outline-primary-500;
  }

  img {
    @apply absolute h-full w-full object-cover overflow-hidden;
  }

  section {
    :global(a) {
      animation: float-down var(--duration) linear var(--delay) infinite;
    }
  }

  p {
    :global(strong) {
      @apply text-primary-500;
    }
  }

  /* prettier-ignore */
  @keyframes float-down {
		0% { transform: translateY(-50%) translateX(-50%); }
		50% { transform: translateY(-40%) translateX(-50%); }
		100% { transform: translateY(-50%) translateX(-50%); }
	}

  /* prettier-ignore */
  @keyframes pulse-outline {
    0% { box-shadow: 0px 0px 2px theme(colors.primary.500) }
    50% { box-shadow: 0px 0px 10px theme(colors.primary.500) }
    100% { box-shadow: 0px 0px 2px theme(colors.primary.500 ) }
  }
</style>
