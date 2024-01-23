<script lang="ts">
  import List from "$com/article-list/wrapper.svelte";
  import Switch from "$inputs/switch.svelte";
  import { portal } from "svelte-portal";

  import { feedLocalSearch, showHighlights } from "$state/state";
  import { filterArticles, hasHighlights } from "$lib/common/filter";
  import { page } from "$app/stores";
  import {
    faEye,
    faEyeSlash,
    faHeading,
    faHighlighter,
  } from "@fortawesome/free-solid-svg-icons";

  import type { ArticleBase } from "$shared/types/api";

  export let articles: ArticleBase[];
  export let emptyMessage: { title: string; description: string } | null = null;

  let showRead = true;

  $: alreadyReadCollection = $page.data.alreadyRead;
  $: alreadyRead = filterArticles(articles, "", $alreadyReadCollection?.ids);

  $: filteredArticles =
    showRead && alreadyReadCollection
      ? filterArticles(articles, $feedLocalSearch)
      : filterArticles(alreadyRead, $feedLocalSearch);

  $: articleWithHighlight = hasHighlights(articles);
</script>

<div
  use:portal={"#header-tab-space"}
  class="
  h-full flex gap-2
  self-center
"
>
  {#if $page.data.user || articleWithHighlight}
    {#if $page.data.user}
      <Switch
        title="{showRead
          ? 'Show'
          : 'Hide'} articles which have been read already"
        name="show-read"
        bind:checked={showRead}
        icons={{ on: faEye, off: faEyeSlash }}
      />
    {/if}

    {#if articleWithHighlight}
      <Switch
        title={showHighlights
          ? "Show article search highlights"
          : "Show article title"}
        name="show-higlights"
        bind:checked={$showHighlights}
        icons={{ on: faHighlighter, off: faHeading }}
        iconClass="text-xs"
      />
    {/if}
  {/if}
</div>

<List
  articles={filteredArticles}
  tintReadArticles={true}
  {emptyMessage}
  showHighlights={$showHighlights}
/>
