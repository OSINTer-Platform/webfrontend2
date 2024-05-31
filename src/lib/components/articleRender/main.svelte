<script lang="ts">
  import CollectionOverlay from "$com/collections/buttonOverlay.svelte";
  import Content from "./content.svelte";

  import type { FullArticle, ArticleCategories } from "$shared/types/api";
  import type { HeadingList } from "$lib/common/ToC";

  export let article: FullArticle;
  export let articleCategories: ArticleCategories | null = null;
  export let header: Boolean = true;

  export let headings: HeadingList = [];
  $: headings = headings ?? [];
  // See https://github.com/sveltejs/svelte/issues/11647

  export let buttonActions: Array<{
    title: string;
    action: () => void;
  }> = [
    {
      title: "Read Article on Website",
      action: () => window.open(article.url, "_blank"),
    },
  ];

  $: readableDate = new Date(article.publish_date).toLocaleString();
</script>

{#if header}
  <div
    class="flex justify-between items-center mb-6 opacity-50 dark:opacity-75"
  >
    <time class="block text-sm">{readableDate}</time>
    <span class="text-xs">Read {article.read_times} times</span>
  </div>

  <h1 class="text-5xl font-semibold">{article.title}</h1>
  {#if articleCategories}
    <div class="flex gap-4 items-center my-6">
      <img
        class="w-14 h-14 object-contain bg-white rounded-sm drop-shadow-md"
        src={articleCategories?.[article.profile]?.image}
        alt="Source logo"
      />
      <ul class="text-sm font-medium">
        <li>
          Written by <span class="text-primary-500 font-bold"
            >{article.author ?? article.source}</span
          >
        </li>
        <li>
          From <span class="text-primary-500 font-bold">{article.source}</span>
        </li>
      </ul>
    </div>
  {/if}
{/if}

<div
  class="
  absolute-grid
  w-full mb-4 aspect-video
  [&:hover>div]:opacity-100
"
>
  <img
    alt="Main Article"
    src={article.image_url}
    class="h-full w-full object-cover overflow-hidden"
  />
  <CollectionOverlay {article} iconClass="text-6xl" overlayClass="top-15" />
</div>

{#if header}
  <h3 class="text-2xl mb-4">{article.description}</h3>
{/if}

{#key article}
  <Content bind:headings {article} />
{/key}

<hr class="border-tertiary-700/25 mb-8" />

<section class="flex">
  {#each buttonActions as { title, action }}
    <button
      on:click={action}
      class="
      p-6

      w-full
      uppercase
      font-bold
      text-tertiary-800
      dark:text-white/90

      border
      border-tertiary-700/50
      border-r-0
      last:border-r
      rounded-sm

      btn
      hover:bg-primary-800/10
      hover:border-primary-600/30
    "
    >
      {title}
    </button>
  {/each}
</section>

<hr class="border-tertiary-700/25 my-8" />

<style lang="postcss">
</style>
