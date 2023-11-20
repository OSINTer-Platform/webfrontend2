<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import SmallLogo from "$assets/smallLogo.jpg";
  import Fa from "svelte-fa";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";

  export let title: string;
  export let description: string;

  export let leftLegend: { text: string; hover: string };
  export let rightLegend: { text: string; hover: string };

  export let imageUrl: string | null = null;
  export let tags: string[] = [];
  export let read: boolean = false;

  export let summary = "";

  let showSummary = false;
</script>

<article
  class="
    relative

    grid
    grid-cols-1
    md:grid-cols-[auto_1fr]

    gap-8

    items-center

    p-3
    sm:p-6

    hover:bg-surface-50
    dark:hover:bg-surface-500

    [&:hover>button]:block
"
>
  <div
    on:click|preventDefault|stopPropagation
    on:keydown|preventDefault|stopPropagation
    class="
      absolute-grid
      w-full md:w-32 max-h-80
      aspect-video md:aspect-square
      drop-shadow-lg

      [&:hover>div]:opacity-100
      hover:z-20
  "
  >
    <img
      class="
        w-full h-full
        object-cover overflow-hidden
        rounded-md
      "
      loading="lazy"
      alt="OSINTer logo"
      src={SmallLogo}
    />
    {#if imageUrl}
      <img
        class="
          w-full h-full
          object-cover overflow-hidden
          rounded-md
        "
        loading="lazy"
        alt="Article Overview"
        src={imageUrl}
      />
    {/if}

    <div
      class="
      rounded-md
      w-full h-full
      bg-surface-100/60 dark:bg-surface-900/60
      {read ? 'block' : 'hidden'}
    "
    />

    <slot name="actions" />
  </div>

  <div
    class="
    flex
    flex-col

    justify-center
    "
  >
    <div
      class="
        flex
        flex-row
        justify-between

        font-light
        text-xs
        dark:text-white

        mb-1
      "
    >
      <p title={leftLegend.hover}>{leftLegend.text}</p>
      <time title={rightLegend.hover}>{rightLegend.text}</time>
    </div>

    <div>
      <h2
        class="
          dark:text-white sm:text-2xl text-xl

          {read ? 'opacity-75' : 'font-bold'}
          [&>strong]:font-semibold
          [&>strong]:text-primary-600
        "
      >
        <SvelteMarkdown source={title} isInline />
      </h2>

      <p
        class="
          {read ? 'font-light' : 'font-normal'}
          text-tertiary-900
          dark:text-white/80
          [&>strong]:font-semibold
          [&>strong]:text-primary-600
        "
      >
        <SvelteMarkdown source={description} isInline />
      </p>
    </div>

    {#if showSummary && summary.length > 0}
      <section transition:slide>
        <hr class="text-surface-400/25 border my-6" />
        <p
          class="
        dark:text-white font-light
      "
        >
          {summary}
        </p>
        <hr class="text-surface-400/25 border my-6" />
      </section>
    {/if}

    {#if tags.length > 0}
      <footer class="flex flex-wrap gap-2 mt-4">
        {#each tags as tag}
          <a
            on:click|stopPropagation
            href="/feed/search?sort_by=publish_date&search_term={encodeURIComponent(
              tag
            )}"
            class="
              py-1 px-3 rounded-full
              shrink-0
              bg-primary-600/20 dark:bg-primary-700/30
              border border-primary-500/50
              uppercase text-xs dark:font-bold
              dark:text-white/80

              hover:bg-primary-400/60 hover:dark:bg-primary-700/75
              transition-colors
            "
          >
            {tag}
          </a>
        {/each}
      </footer>
    {/if}
  </div>

  {#if summary.length > 0}
    <button
      class="
    absolute
    right-2 bottom-2

    hidden btn

    w-10 p-3
    dark:bg-surface-500 dark:hover:bg-primary-400/25
    drop-shadow-md

    transition-transform
  "
      on:click|preventDefault|stopPropagation={() =>
        (showSummary = !showSummary)}
    >
      <Fa
        icon={faCaretDown}
        class="
        mx-auto
        transition-transform duration-300
        {showSummary ? 'rotate-180' : ''}
    "
      />
    </button>
  {/if}
</article>
