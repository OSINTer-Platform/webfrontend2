<script lang="ts">
  import Search from "$inputs/search.svelte";
  import ArticleSearch from "$inputs/articleSearch.svelte";
  import Switch from "$inputs/switch.svelte";

  import Tabs from "$com/tabs.svelte";
  import ModList from "./modList.svelte";

  import type {
    ArticleListRender,
    HeaderModOptions,
  } from "$shared/types/internal";
  import type { Writable } from "svelte/store";

  import { hasHighlights, hasSummary } from "$lib/common/filter";
  import {
    showRead,
    showHighlights,
    listElementCount,
    expandSummary,
    expandHighlights,
  } from "$state/state";
  import { page } from "$app/stores";
  import {
    faEye,
    faEyeSlash,
    faHeading,
    faHighlighter,
    faRectangleList,
  } from "@fortawesome/free-solid-svg-icons";
  import { ListRenderModes } from "$shared/config";
  import Fa from "svelte-fa";
  import type { ArticleBase } from "$shared/types/api";

  export let title: string;
  export let badge: string = "";
  export let description: string = "";

  export let searchAble = true;
  export let searchSubmitable = true;

  export let contentType = "articles";
  export let articles: ArticleBase[] | undefined = undefined;

  export let showReadFilter = true;

  export let tabs: null | {
    store: Writable<string>;
    options: { name: string; value: ArticleListRender }[];
  } = {
    store: $page.data.settings.listRenderMode,
    options: ListRenderModes,
  };
  $: tabStore = tabs?.store ?? $page.data.settings.listRenderMode;
  $: user = $page.data.user;

  export let searchValue: string = "";

  export let modOptions: Array<HeaderModOptions> = [];

  $: articleWithHighlight = hasHighlights(articles ?? $page.data.articles);
  $: articleWithSummary = hasSummary(articles ?? $page.data.articles);

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

<aside
  class="
	bg-surface-200
	dark:bg-surface-800

	border-b
  border-surface-300
	dark:border-surface-400

	p-6
	sm:p-12

	!pb-0
"
>
  <header
    class="flex justify-between {description ? 'sm:mb-2' : 'sm:mb-10 mb-4'}"
  >
    <section class="flex items-start gap-3">
      <slot name="title">
        <h1 class="sm:text-5xl text-3xl">{title}</h1>
      </slot>
      {#if badge}
        <span
          class="
					px-2 py-1
					
					mt-2 sm:mt-3
					
					rounded-full

					bg-surface-900
					text-surface-50

					dark:bg-surface-50
					dark:text-surface-900

					text-[0.6rem]
					sm:text-xs
					font-bold
					capitalize
				">{badge}</span
        >
      {/if}
    </section>

    <section class="flex items-start ml-3 md:ml-6 mt-1 sm:mt-2">
      <ModList {modOptions} />
    </section>
  </header>
  {#if description}
    <p class="text-sm sm:text-base italic font-light sm:dark:font-medium">
      {description}
    </p>
  {/if}

  <slot>
    <hr class="border-tertiary-600/50 my-4" />
  </slot>

  {#if searchAble}
    <svelte:component
      this={searchSubmitable ? ArticleSearch : Search}
      bind:value={searchValue}
      placeholder={"Filter displayed articles"}
      containerClass={"w-full my-6"}
      infoText={`${$listElementCount} ${contentType}`}
    />
  {/if}

  {#if tabs}
    <Tabs bind:selected={$tabStore} options={tabs.options}>
      <svelte:fragment slot="end">
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
      </svelte:fragment>
    </Tabs>
  {/if}
</aside>
