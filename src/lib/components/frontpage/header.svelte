<script lang="ts">
  import LogoFull from "$assets/LogoFull.svelte";
  import Grid from "./grid.svelte";
  import FloatingArticles from "./floatingArticles.svelte";

  import { page } from "$app/stores";
  import { PUBLIC_PURCHASE_AVAILABLE } from "$env/static/public";

  import type { TrendingArticleBundle } from "./types";

  $: user = $page.data.user;
  $: authorizer = $page.data.checkAuthorization;

  export let mouse: null | { x: number; y: number };
  export let trendingArticles: TrendingArticleBundle[];
</script>

<div class="grid grid-cols-1">
  <Grid
    class="hidden dark:grid opacity-50"
    style="
      mask-image: linear-gradient(rgb(0 0 0 / 100%), transparent);
      -webkit-mask-image: linear-gradient(rgb(0 0 0 / 100%), transparent);
    "
  />

  {#if mouse}
    <Grid
      class="hidden sm:dark:grid opacity-50"
      style="
        mask-image: radial-gradient(
          500px circle at {mouse?.x}px {mouse?.y}px,
          rgb(0 0 0 / 100%),
          transparent);
        -webkit-mask-image: radial-gradient(
          500px circle at {mouse?.x}px {mouse?.y}px,
          rgb(0 0 0 / 100%),
          transparent);
      "
    />
  {/if}

  <div
    class="
    container z-10 row-start-1 col-start-1
    flex flex-col gap-24 lg:gap-0
    lg:grid lg:grid-cols-2
    items-center justify-items-center
    pb-16 pt-36
    px-6 sm:px-0
  "
  >
    <section class="w-full">
      <div class="hidden sm:block px-8">
        <h2
          class="
          text-3xl md:text-4xl lg:text-2xl xl:text-4xl
          max-lg:ml-6
          font-bold dark:text-white/50
        "
        >
          Automating the CTI heavylifting
        </h2>
        <LogoFull
          class="
          lg:w-auto
          lg:-m-5 xl:-m-6
          max-lg:-my-6
        "
        />
        <h3
          class="
          -mt-4 md:-mt-8 lg:-mt-2
          ml-16 lg:ml-6 xl:ml-8
          md:text-lg lg:text-base xl:text-xl

          lg:tracking-tighter xl:tracking-tight
          font-light
        "
        >
          Experience a new approach to CTI, helping you do more with less.
        </h3>
      </div>

      <div class="sm:hidden w-full">
        <LogoFull class="w-full" />

        <h3
          class="
          ml-[7vw] -mt-[4vw]
          font-light
        "
        >
          Automating the CTI heavylifting
        </h3>
      </div>

      <div
        class="
        flex gap-2 sm:gap-4
        mx-auto
        mt-4 xl:mt-8
        ml-[6vw] sm:ml-16 md:ml-20 lg:ml-10 xl:ml-12

        text-sm sm:text-base
      "
      >
        {#if $user && $authorizer("articles")}
          <a
            href="/news"
            class="
            bg-primary-700
            hover:bg-primary-600

            transition-colors
            duration-300

            px-4
            py-2
            text-white
            font-semibold
          ">News</a
          >
        {:else if $user && PUBLIC_PURCHASE_AVAILABLE}
          <a
            href="/purchase"
            class="
            bg-primary-700
            hover:bg-primary-600

            transition-colors
            duration-300

            px-4
            py-2
            text-white
            font-semibold
          ">Subscribe</a
          >
        {:else}
          <a
            href="/login"
            class="
            bg-primary-700
            hover:bg-primary-600

            transition-colors
            duration-300

            px-4
            py-2
            text-white
            font-semibold
          ">Login</a
          >
        {/if}

        {#if !$user}
          <a
            href="/signup"
            class="
              px-4 py-2 flex gap-3
              border border-surface-400
              bg-surface-200 hover:bg-surface-200
              dark:bg-surface-900 dark:hover:bg-surface-700
              font-light
              transition-colors duration-300
          "
          >
            Signup
          </a>
        {:else}
          <a
            href="/blog"
            class="
              px-4 py-2 flex gap-3
              border border-surface-400
              bg-surface-200 hover:bg-surface-200
              dark:bg-surface-900 dark:hover:bg-surface-700
              font-light
              transition-colors duration-300
          "
          >
            Read more
          </a>
        {/if}
      </div>
    </section>

    <FloatingArticles {trendingArticles} />
  </div>
</div>

<style lang="postcss">
</style>
