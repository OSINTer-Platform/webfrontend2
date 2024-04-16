<script lang="ts">
  import { hasHighlights, hasSummary } from "$lib/common/filter";
  import type { ArticleBase } from "$shared/types/api";
  import {
    faEye,
    faEyeSlash,
    faHeading,
    faHighlighter,
    faRectangleList,
  } from "@fortawesome/free-solid-svg-icons";

  import {
    showRead,
    showHighlights,
    expandSummary,
    expandHighlights,
  } from "$state/state";
  import { page } from "$app/stores";
  import Fa from "svelte-fa";
  import Switch from "$com/utils/inputs/switch.svelte";

  export let articles: ArticleBase[];
  export let showReadFilter: boolean;

  $: user = $page.data.user;

  $: articleWithHighlight = hasHighlights(articles);
  $: articleWithSummary = hasSummary(articles);

  $: expanderButtons = [
    ...(articleWithHighlight
      ? [
          {
            icon: faHighlighter,
            title: "highlights",
            expand: !$expandHighlights,
            externalStore: expandHighlights,
          },
        ]
      : []),
    ...(articleWithSummary
      ? [
          {
            icon: faRectangleList,
            title: "summary",
            expand: !$expandSummary,
            externalStore: expandSummary,
          },
        ]
      : []),
  ];

  $: readFilterAvailable = $user && showReadFilter;
  $: showFilterOptions = readFilterAvailable || articleWithHighlight;
  $: showExpandOptions = expanderButtons.length > 0;
</script>

{#if showFilterOptions || showExpandOptions}
  <section class="ml-auto py-2 flex">
    {#if showExpandOptions}
      <div class="flex gap-2">
        {#each expanderButtons as { icon, title, expand, externalStore }}
          <button
            class="
              btn px-2
              shadow-black/25 dark:shadow-black shadow-sm
              {expand ? '' : '!text-primary-500'}
            "
            title="{expand ? 'Show' : 'Hide'} all {title}"
            on:click={() => {
              externalStore.set(expand);
            }}
          >
            <Fa {icon} />
          </button>
        {/each}
      </div>
    {/if}
    {#if showFilterOptions && showExpandOptions}
      <div class="my-1 mx-2 border border-surface-400/50" />
    {/if}
    {#if showFilterOptions}
      <div class="flex gap-2">
        {#if readFilterAvailable}
          <Switch
            title="{$showRead
              ? 'Show'
              : 'Hide'} articles which have been read already"
            name="show-read"
            bind:checked={$showRead}
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
      </div>
    {/if}
  </section>
{/if}
