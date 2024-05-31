<script lang="ts">
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { slide } from "svelte/transition";

  export let detail: string | Array<string | { content: string; href: string }>;

  export let mono: boolean;

  let showFull = false;

  const boxClass =
    "text-xs py-1 px-2 inline block w-fit bg-primary-500/20 border border-primary-600 truncate shrink-0";
</script>

{#if Array.isArray(detail)}
  <div
    transition:slide
    class="
      h-full {showFull ? '' : 'max-h-48'}
      overflow-hidden flex flex-wrap gap-3 ml-3 pb-3 relative
    "
  >
    {#each detail as subDetail}
      {#if typeof subDetail === "string"}
        <p class="{boxClass} {mono ? 'uppercase' : 'capitalize'}">
          {subDetail}
        </p>
      {:else}
        <a
          href={subDetail.href}
          class="
              {boxClass} {mono ? 'uppercase' : 'capitalize'}
              hover:bg-primary-400/60 hover:dark:bg-primary-700/75
              transition-colors
            "
        >
          {subDetail.content}
        </a>
      {/if}
    {/each}

    <div
      class:hidden={showFull}
      class="
        absolute top-32 bottom-0 left-0 right-0
        flex items-end justify-center
        pointer-events-none
        {showFull
        ? ''
        : 'bg-gradient-to-b from-transparent via-surface-200/80 to-surface-200 dark:via-surface-800/70 dark:to-surface-800'}
      "
    />

    <button
      on:click={() => (showFull = !showFull)}
      class:rotate-180={showFull}
      class="
        btn
        absolute left-1/2 -translate-x-2/3
        {showFull ? 'bottom-0' : 'top-40'}
        py-2 px-20
    "
    >
      <Fa icon={faCaretDown} />
    </button>
  </div>
{:else}
  <p class="{boxClass} {mono ? 'uppercase font-mono' : ''} ml-3 mb-3">
    {detail}
  </p>
{/if}
