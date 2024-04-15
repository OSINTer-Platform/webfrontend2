<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import SmallLogo from "$assets/smallLogo.jpg";
  import Fa from "svelte-fa";
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";

  export let title: { text: string; markdown: boolean };
  export let description: { text: string; markdown: boolean };

  export let leftLegend: { text: string; hover: string };
  export let rightLegend: { text: string; hover: string };

  export let imageUrl: string | undefined = undefined;
  export let tags: string[] = [];
  export let read: boolean = false;

  export let textExpands: {
    title: string;
    icon: IconDefinition;
    content: string;
    expanded: boolean;
    markdown: boolean;
  }[] = [];
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

    [&:hover>aside]:flex
"
>
  <div
    role="presentation"
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

    <slot name="icons" />
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

        mb-1
      "
    >
      <p title={leftLegend.hover}>{leftLegend.text}</p>
      <p title={rightLegend.hover}>{rightLegend.text}</p>
    </div>

    <div>
      <h2
        class="
          sm:text-2xl text-xl

          {read ? 'opacity-75' : 'font-bold'}
          [&>strong]:font-semibold
          [&>strong]:text-primary-600
        "
      >
        {#if title.markdown}
          <SvelteMarkdown source={title.text} isInline />
        {:else}
          {title.text}
        {/if}
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
        {#if description.markdown}
          <SvelteMarkdown source={description.text} isInline />
        {:else}
          {description.text}
        {/if}
      </p>
    </div>

    <section class="">
      {#each textExpands as { title, content, expanded, markdown } (title)}
        {#if expanded}
          <div
            transition:slide
            class="py-6 border-surface-400/25 border-b first:border-t first:mt-6 last:mb-6"
          >
            <p
              class="
              font-light
              [&>strong]:font-semibold
              [&>strong]:text-primary-600
            "
            >
              <span class="font-semibold capitalize">{title}: </span>
              {#if markdown}
                <SvelteMarkdown source={content} isInline={true} />
              {:else}
                {content}
              {/if}
            </p>
          </div>
        {/if}
      {/each}
    </section>

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

  <aside class="absolute right-2 bottom-2 gap-2 hidden">
    {#each textExpands as { title, icon, expanded }}
      <button
        title="Show {title}"
        class="
          btn w-10 p-3 opacity-85
          dark:bg-surface-500 dark:hover:bg-primary-400/25
          drop-shadow-md transition-transform
        "
        on:click|preventDefault|stopPropagation={() => (expanded = !expanded)}
      >
        <Fa
          {icon}
          class="
          mx-auto text-sm
          transition-transform duration-300
          {expanded ? 'text-primary-500' : ''}
      "
        />
      </button>
    {/each}
  </aside>
</article>
