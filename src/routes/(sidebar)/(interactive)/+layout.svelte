<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  let javascript = false;

  onMount(() => {
    if (browser) {
      javascript = true;
    }
  });
</script>

{#if javascript}
  <slot />
{:else}
  <main class="w-full h-full bg-surface-100 dark:bg-surface-800">
    <div
      class="h-full mx-auto px-8 xl:max-w-5xl max-w-2xl flex flex-col justify-center text-center dark:text-white"
    >
      <h2
        class="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold md:mb-2"
      >
        Javascript has to be enabled
      </h2>
      <p
        class="xl:text-2xl md:text-xl sm:text-lg font-light md:tracking-tighter"
      >
        It doesn't seem like Javascript is enabled - or something is interfering
        with it. Please turn Javascript back on to use this page.
      </p>
    </div>
  </main>
{/if}
