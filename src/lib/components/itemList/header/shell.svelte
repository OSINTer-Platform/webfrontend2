<script lang="ts">
  import Search from "$inputs/search.svelte";
  import ArticleSearch from "$inputs/articleSearch.svelte";
  import ArticleFilters from "./articleFilters.svelte";
  import Tabs from "$com/tabs.svelte";
  import ModList from "./modList.svelte";

  import type {
    ArticleListRender,
    HeaderModOptions,
  } from "$shared/types/internal";
  import type { Writable } from "svelte/store";
  import type { ArticleBase } from "$shared/types/api";

  import { listElementCount } from "$state/state";
  import { page } from "$app/stores";
  import { ListRenderModes } from "$shared/config";

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

  $: pageArticles = $page.data.articles;
  $: pageLoadingArticles = $page.data.loadingArticles;

  export let searchValue: string = "";

  export let modOptions: Array<HeaderModOptions> = [];
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
  <header class="flex justify-between sm:mb-4">
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
      placeholder={`Filter displayed ${contentType}`}
      containerClass={"w-full my-6"}
      infoText={`${$listElementCount} ${contentType}`}
    />
  {/if}

  {#if tabs}
    <Tabs bind:selected={$tabStore} options={tabs.options}>
      <svelte:fragment slot="end">
        {#if articles}
          <ArticleFilters {articles} {showReadFilter} />
        {:else if pageArticles}
          <ArticleFilters articles={pageArticles} {showReadFilter} />
        {:else if pageLoadingArticles}
          {#await $pageLoadingArticles then articles}
            {#if articles}
              <ArticleFilters {articles} {showReadFilter} />
            {/if}
          {/await}
        {/if}
      </svelte:fragment>
    </Tabs>
  {/if}
</aside>
