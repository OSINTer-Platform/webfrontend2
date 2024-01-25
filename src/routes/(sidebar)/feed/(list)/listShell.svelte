<script lang="ts">
  import List from "$com/article-list/wrapper.svelte";
  import Switch from "$inputs/switch.svelte";
  import { portal } from "svelte-portal";

  import {
    showingSummary,
    showingHighlights,
  } from "$com/article-list/layouts/large/article.svelte";

  import { feedLocalSearch, showHighlights } from "$state/state";
  import { filterArticles, hasHighlights } from "$lib/common/filter";
  import { page } from "$app/stores";
  import {
    faEye,
    faEyeSlash,
    faHeading,
    faHighlighter,
    faRectangleList,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons";

  import type { ArticleBase } from "$shared/types/api";
  import Fa from "svelte-fa";
  import { get, type Writable } from "svelte/store";

  export let articles: ArticleBase[];
  export let emptyMessage: { title: string; description: string } | null = null;

  let showRead = true;

  let expanderButtons: {
    icon: IconDefinition;
    title: string;
    expand: boolean;
    externalStore: Writable<boolean>;
  }[];

  $: expanderButtons = [
    ...(articleWithHighlight
      ? [
          {
            icon: faHighlighter,
            title: "highlights",
            expand: !$showingHighlights,
            externalStore: showingHighlights,
          },
        ]
      : []),
    ...(articleWithSummary
      ? [
          {
            icon: faRectangleList,
            title: "summary",
            expand: !$showingSummary,
            externalStore: showingSummary,
          },
        ]
      : []),
  ];

  $: alreadyReadCollection = $page.data.alreadyRead;
  $: alreadyRead = filterArticles(articles, "", $alreadyReadCollection?.ids);

  $: filteredArticles =
    showRead && alreadyReadCollection
      ? filterArticles(articles, $feedLocalSearch)
      : filterArticles(alreadyRead, $feedLocalSearch);

  $: articleWithHighlight = hasHighlights(articles);
  $: articleWithSummary = articles.some(
    (a) => a.summary?.length && a.summary.length > 0
  );

  $: console.log($showingHighlights, expanderButtons[0].expand);
</script>

<div
  use:portal={"#header-tab-space"}
  class="
  h-full flex gap-2
  self-center
"
>
  {#each expanderButtons as { icon, title, expand, externalStore }}
    <button
      class="
        btn my-2 px-2
        shadow-black/25 dark:shadow-black shadow-sm
        {expand ? '' : '!text-primary-500'}
      "
      title="{expand ? 'Show' : 'Hide'} all {title}"
      on:click={() => {
        console.log(get(externalStore), expand);
        externalStore.set(expand);
      }}
    >
      <Fa {icon} />
    </button>
  {/each}

  <div class="my-2 mx-2 border border-surface-400/25" />

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
