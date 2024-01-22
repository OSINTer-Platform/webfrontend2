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
  import { writable, type Writable } from "svelte/store";

  import { hasHighlights } from "$lib/common/filter";
  import { articleListRender, showRead, showHighlights } from "$state/state";
  import { page } from "$app/stores";
  import {
    faEye,
    faEyeSlash,
    faHeading,
    faHighlighter,
  } from "@fortawesome/free-solid-svg-icons";
  import { ListRenderModes } from "$shared/config";

  export let title: string;
  export let badge: string = "";
  export let description: string = "";
  export let searchAble = true;
  export let contentType = "articles";

  export let tabs: null | {
    store: Writable<string>;
    options: { name: string; value: ArticleListRender }[];
  } = {
    store: articleListRender,
    options: ListRenderModes,
  };
  $: tabStore = tabs?.store ?? writable("");

  export let searchValue: string = "";

  export let modOptions: Array<HeaderModOptions> = [];

  $: listCount = $page.data.listElementCount;
  $: searchInfo = listCount ? `${$listCount} ${contentType}` : "";
  $: articleWithHighlight = hasHighlights($page.data.articles);
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
        <h1 class="sm:text-5xl text-3xl dark:text-white">{title}</h1>
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
    <p
      class="text-sm sm:text-base italic font-light sm:dark:font-medium dark:text-white"
    >
      {description}
    </p>
  {/if}

  <slot>
    <hr class="text-tertiary-600/50 my-4" />
  </slot>

  <svelte:component
    this={searchAble ? ArticleSearch : Search}
    bind:value={searchValue}
    placeholder={"Filter displayed articles"}
    containerClass={"w-full my-6"}
    infoText={searchInfo}
  />

  {#if tabs}
    <Tabs bind:selected={$tabStore} options={tabs.options}>
      <svelte:fragment slot="end">
        {#if $page.url.pathname.startsWith("/feed") && ($page.data.user || articleWithHighlight)}
          <div
            class="
            ml-auto flex gap-2
            self-center
          "
          >
            {#if $page.data.user}
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
      </svelte:fragment>
    </Tabs>
  {/if}
</aside>
