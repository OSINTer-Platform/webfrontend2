<script lang="ts">
  import SmallLogo from "$assets/smallLogo.jpg";
  import Link from "$com/modalLink.svelte";
  import CollectionOverlay from "$com/collections/buttonOverlay.svelte";
  import SvelteMarkdown from "svelte-markdown";
  import Fa from "svelte-fa";

  import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
  import { getTimespan } from "$lib/common/math";
  import { slide } from "svelte/transition";

  import type { ArticleBase } from "$shared/types/api";

  export let articleList: ArticleBase[];
  export let article: ArticleBase;
  export let readArticles: string[];

  let showSummary = false;

  $: read = readArticles.includes(article.id);
</script>

<hr class="text-tertiary-500 dark:text-surface-500 my-3" />

<Link {article} {articleList}>
  <article
    class="
      relative

      grid
      grid-cols-1
      md:grid-cols-[auto_1fr]

      gap-14

      items-center

      p-5
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
        w-full md:w-48 max-h-[30rem]
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

      <img
        class="
          w-full h-full
          object-cover overflow-hidden
          rounded-md
        "
        loading="lazy"
        alt="Article Overview"
        src={article.image_url}
      />

      <div
        class="
        rounded-md
        w-full h-full
        bg-surface-100/60 dark:bg-surface-900/60
        {read ? 'block' : 'hidden'}
      "
      />

      <CollectionOverlay {article} overlayClass="top-12" iconClass="text-5xl" />
    </div>

    <div class="flex flex-col justify-center">
      <div
        class="
          flex flex-row justify-between
          font-light text-xs dark:text-white
          mb-2
        "
      >
        <p title={article.profile}>{article.source}</p>
        <time title={article.publish_date}
          >{getTimespan(article.publish_date)}</time
        >
      </div>

      <div>
        <h2
          class="
            dark:text-white lg:text-4xl text-3xl

            {read ? 'opacity-75' : 'font-bold'}
            [&>strong]:font-semibold
            [&>strong]:text-primary-600
          "
        >
          <SvelteMarkdown source={article.title} isInline />
        </h2>

        <p
          class="
            sm:text-lg md:text-base lg:text-lg
            {read ? 'font-light' : 'font-normal'}
            text-tertiary-900 dark:text-white/80
            [&>strong]:font-semibold
            [&>strong]:text-primary-600
          "
        >
          <SvelteMarkdown source={article.description} isInline />
        </p>
      </div>

      {#if showSummary && article.summary && article.summary.length > 0}
        <section transition:slide>
          <hr class="text-surface-400/25 border my-9" />
          <p class="dark:text-white font-light">
            {article.summary}
          </p>
          <hr class="text-surface-400/25 border my-9" />
        </section>
      {/if}

      {#if article.tags.automatic.length > 0}
        <footer class="flex flex-wrap gap-3 mt-6">
          {#each article.tags.automatic as tag}
            <a
              on:click|stopPropagation
              href="/feed/search?sort_by=publish_date&search_term={encodeURIComponent(
                tag
              )}"
              class="
                py-1 px-4 rounded-full
                shrink-0
                bg-primary-600/20 dark:bg-primary-700/30
                border border-primary-500/50
                uppercase text-xs dark:font-normal
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

    {#if article.summary && article.summary.length > 0}
      <button
        class="
          absolute
          right-3 bottom-3

          hidden btn

          w-10 aspect-square
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
</Link>
