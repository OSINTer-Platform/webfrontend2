<script lang="ts">
  import Fa from "svelte-fa";
  import SvelteMarkdown from "svelte-markdown";

  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import { formatPrice } from "$lib/common/strings";

  export let index: number;
  export let title: string;
  export let bulletPoints: { icon: IconDefinition; text: string }[];
  export let pricePanel: {
    price: { amount: number; currency: string; period: string } | string;
    topText?: string;
    bottomText?: string;
  };
</script>

<li
  class="
  price price{index}
  flex flex-col justify-between
  overflow-hidden list-none
  border-black/50 dark:border-white/50 border
  bg-surface-50 dark:bg-surface-800
"
>
  <header
    class="
    py-6
    flex justify-center items-center
    {index === 0 ? 'bg-primary-500/40' : ''}
    {index === 1 ? 'bg-primary-500/60' : ''}
    {index === 2 ? 'bg-primary-500/40' : ''}
  "
  >
    <h2 class="uppercase font-extrabold text-xl sm:text-2xl">{title}</h2>
  </header>

  <main class="p-4">
    <section
      class="
      flex flex-col
      items-center justify-center
      sm:h-32 mt-4 mb-8
    "
    >
      {#if pricePanel.topText}
        <p class="font-light text-sm">{pricePanel.topText}</p>
      {/if}

      {#if typeof pricePanel.price === "object"}
        {@const { amount, currency, period } = pricePanel.price}
        <h2 class="text-6xl sm:text-7xl font-bold">
          {formatPrice(amount, currency)}<span class="text-xl font-light"
            >/{period}</span
          >
        </h2>
      {:else}
        <h2 class="text-7xl font-bold">{pricePanel.price}</h2>
      {/if}

      {#if pricePanel.bottomText}
        <p class="text-sm">{pricePanel.bottomText}</p>
      {/if}
    </section>

    <ul class="flex flex-col gap-4 mb-4 sm:mb-8">
      {#each bulletPoints as { icon, text }}
        <li
          class="flex items-center gap-4 font-light text-sm sm:text-base cursor-default"
        >
          <div
            class="
              p-2
              rounded-full border
              border-black/20 dark:border-white/20
            "
          >
            <Fa {icon} />
          </div>
          <SvelteMarkdown source={text} />
        </li>
      {/each}
    </ul>
  </main>
  <slot />
</li>

<style lang="postcss">
  li {
    :global(strong) {
      @apply font-bold;
    }
  }
</style>
