<script lang="ts">
  import { page } from "$app/stores";
  import type { ArticleBase } from "$shared/types/api";
  import List from "./main.svelte";

  export let articles: ArticleBase[];
  let classes: string = "";
  export { classes as class };
  export let tintReadArticles: boolean;
  export let showHighlights: boolean;
  export let listLenLimit = 100;

  $: articleListRender = $page.data.settings.listRenderMode;

  let defaultMessage: {
    title: string;
    description: string;
  } = {
    title: "Well, it looks rather empty here.",
    description:
      "Try using another feed or collection, or contact your system administrator if you believe this is an error",
  };

  export let emptyMessage: typeof defaultMessage | null = null;
</script>

<div
  class="
	bg-surface-100
	dark:bg-surface-900

	grow

	p-4
	sm:p-12
  {classes}
"
>
  {#if articles.length > 0}
    <slot name="top" />
    <List
      {articles}
      layout={$articleListRender}
      {showHighlights}
      {tintReadArticles}
      {listLenLimit}
    />
    <slot name="bottom" />
  {:else}
    <div
      class="h-full mx-auto px-8 max-w-2xl flex flex-col justify-center text-center"
    >
      <h2 class="md:text-4xl sm:text-3xl text-2xl font-bold md:mb-2">
        {emptyMessage?.title ?? defaultMessage.title}
      </h2>
      <p class="md:text-xl sm:text-lg font-light md:tracking-tighter">
        {emptyMessage?.description ?? defaultMessage.description}
      </p>
    </div>
  {/if}
</div>
