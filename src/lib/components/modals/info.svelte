<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import Modal from "./modal.svelte";

  export let title: string;
  export let description: string | string[];
</script>

<Modal
  class="
    p-6
    w-[40rem] max-w-[90vw]
    flex flex-col
    overflow-y-auto

    bg-surface-100 dark:bg-surface-800
  "
  style="max-height: min(90vh, 40rem)"
>
  <h1
    class="
    mb-2 block border-b border-surface-500
    font-bold
    text-lg sm:text-xl md:text-2xl xl:text-3xl
  "
  >
    {title}
  </h1>
  {#if Array.isArray(description)}
    {#each description as desc}
      <p class="font-light text-sm sm:text-base mb-4">
        <SvelteMarkdown source={desc} isInline />
      </p>
    {/each}
  {:else}
    <p class="font-light text-sm sm:text-base">
      <SvelteMarkdown source={description} isInline />
    </p>
  {/if}
</Modal>

<style lang="postcss">
  p {
    :global(a) {
      @apply underline hover:text-primary-500 transition-colors duration-300;
    }
  }
</style>
