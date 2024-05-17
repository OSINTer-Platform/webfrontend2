<script lang="ts">
  import Cyber from "$assets/Cyber.svelte";
  import LogoFull from "$assets/LogoFull.svelte";
  import Fa from "svelte-fa";
  import Grid from "./grid.svelte";

  import { sponsorLink } from "$shared/config";
  import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
  import { page } from "$app/stores";

  $: darkMode = $page.data.settings.darkMode;

  export let mouse: null | { x: number; y: number };
</script>

<div class="grid grid-cols-1">
  <Grid
    class="hidden dark:grid opacity-50 sm:opacity-25"
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
    lg:grid lg:grid-cols-2
    items-center justify-items-center
    py-24 sm:py-48
    px-6 sm:px-0
  "
  >
    <div>
      <div class="hidden sm:block">
        <h1
          class="
          text-3xl md:text-4xl lg:text-2xl xl:text-4xl
          max-lg:ml-6
          font-bold dark:text-white/50
        "
        >
          Automating the CTI heavylifting
        </h1>
        <LogoFull
          class="
          lg:w-auto xl:h-30
          lg:-m-5 xl:-m-6
          max-lg:-my-6
        "
        />
        <h2
          class="
          -mt-4 md:-mt-6 lg:-mt-2
          ml-16 lg:ml-6 xl:ml-8
          md:text-lg lg:text-base xl:text-xl

          lg:tracking-tighter xl:tracking-tight
          font-light
        "
        >
          Experience a new approach to CTI, helping you do more with less.
        </h2>
      </div>

      <div class="sm:hidden">
        <LogoFull
          class="
        "
        />

        <h1
          class="
          ml-12 -mt-4
          font-light
        "
        >
          Automating the CTI heavylifting
        </h1>
      </div>

      <div
        class="
        flex gap-2 sm:gap-4
        mx-auto
        mt-4 xl:mt-8
        sm:ml-16 lg:ml-6 xl:ml-8

        text-xs sm:text-base
      "
      >
        <a
          href="/news"
          class="
          bg-primary-700
          hover:bg-primary-600

          transition-colors
          duration-300

          px-4
          py-2
          rounded-lg
          text-white
          font-semibold
        ">Get started</a
        >

        <a
          href={sponsorLink}
          class="
          bg-surface-200/75
          hover:bg-surface-200

          dark:bg-surface-900/75
          dark:hover:bg-surface-700

          transition-colors
          duration-300

          border
          border-surface-400

          px-4
          py-2
          flex gap-3
          rounded-lg

          font-light
        "
        >
          Sponsor us
          <Fa icon={faHandHoldingDollar} class="mt-1" />
        </a>
      </div>
    </div>

    <div class="lg:grid grid-cols-1 aspect-square h-60 xl:h-72 hidden">
      <Cyber
        class="
        h-full w-full
        col-start-1 row-start-1
        z-10
        drop-shadow-xl
      "
      />
      <div
        class="
        h-full w-full
        col-start-1 row-start-1
        rounded-full
        blur-2xl
        transition-all
        {$darkMode ? 'img-dark-bg' : 'img-bg'}
      "
      />
    </div>
  </div>
</div>

<style lang="postcss">
  .img-bg {
    animation: pulse 5s linear infinite, light-glow 5s linear infinite;
  }

  .img-dark-bg {
    animation: pulse 5s linear infinite, dark-glow 5s linear infinite;
  }

  @keyframes dark-glow {
    0% {
      @apply bg-secondary-600/30;
    }
    25% {
      @apply bg-primary-500/10;
    }
    50% {
      @apply bg-primary-500/20;
    }
    75% {
      @apply bg-primary-500/10;
    }
    100% {
      @apply bg-secondary-600/30;
    }
  }

  @keyframes light-glow {
    0% {
      @apply bg-primary-400/20;
    }
    25% {
      @apply bg-primary-200/40;
    }
    50% {
      @apply bg-secondary-200/40;
    }
    75% {
      @apply bg-primary-200/40;
    }
    100% {
      @apply bg-primary-400/20;
    }
  }
  @keyframes pulse {
    50% {
      transform: scale(1.5);
    }
  }
</style>
