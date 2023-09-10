<script lang="ts">
  import type { Article, ArticleCategories } from "$shared/types/api";
  import type { HeadingList, ParsedEvent } from "$lib/common/ToC";

  import { MDtoToC } from "$lib/common/ToC";

  import SvelteMarkdown from "svelte-markdown";

  export let article: Article;
  export let articleCategories: ArticleCategories | null = null;
  export let header: Boolean = true;

  export let headings: HeadingList = [];

  function handleParsed(e: ParsedEvent) {
    headings = MDtoToC(e);
  }

  $: readableDate = new Date(article.publish_date).toLocaleString();
</script>

{#if header}
  <div
    class="flex justify-between items-center mb-6 opacity-50 dark:opacity-75 dark:text-white"
  >
    <time class="block text-sm">{readableDate}</time>
    <span class="text-xs">Read {article.read_times} times</span>
  </div>

  <h1 class="text-5xl font-semibold dark:text-white">{article.title}</h1>
  {#if articleCategories}
    <div class="flex gap-4 items-center my-6">
      <img
        class="w-14 h-14 object-contain bg-white rounded-md drop-shadow-md"
        src={articleCategories?.[article.profile]?.image}
        alt="Source logo"
      />
      <ul class="text-tertiary-900 text-sm font-medium dark:text-white">
        <li>
          Written by <span
            class="text-black dark:text-primary-400 dark:font-bold"
            >{article.author}</span
          >
        </li>
        <li>
          From <span class="text-black dark:text-primary-400 dark:font-bold"
            >{article.source}</span
          >
        </li>
      </ul>
    </div>
  {/if}
{/if}

<img
  alt="Main Article"
  src={article.image_url}
  class="aspect-video w-full object-cover mb-4"
/>

{#if header}
  <h3 class="text-2xl mb-4 dark:text-white">{article.description}</h3>
{/if}

<div class="article-content-render text-justify">
  <SvelteMarkdown source={article.formatted_content} on:parsed={handleParsed} />
</div>

<hr class="text-tertiary-700/25 mb-8" />

<button
  on:click={() => window.open(article.url, "_blank")}
  class="
	p-6

	w-full
	uppercase
	font-bold
	text-tertiary-800
	dark:text-white/90

	border
	border-tertiary-700/50
	rounded-sm

	btn
	hover:bg-primary-800/10
	hover:border-primary-600/30
"
>
  Read article on website
</button>

<hr class="text-tertiary-700/25 my-8" />

<style lang="postcss">
</style>
