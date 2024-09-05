<script lang="ts">
  import MajorSection from "./majorSection.svelte";
  import SearchPanel from "./searchQuery.svelte";
  import SourceSelect from "./sourceSelect.svelte";
  import TwoHalfs from "$com/utils/twohalfs.svelte";
  import Fa from "svelte-fa";

  import {
    faArrowsRotate,
    faDownload,
    faPlus,
    faSpinner,
  } from "@fortawesome/free-solid-svg-icons";

  import type {
    ArticleCategories,
    ArticleSearchQuery,
  } from "$shared/types/api";
  import type { SearchRestrictFields } from "$shared/types/internal";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import { getStandardSearch } from "$shared/config";
  import { createItem, sanitizeQuery } from "$lib/common/userItems";
  import { toUrl } from "$lib/common/searchQuery";

  export let callback:
    | null
    | ((q: ArticleSearchQuery) => void | Promise<void>) = null;
  export let searchQuery: ArticleSearchQuery = getStandardSearch();
  export let sourceCategories: ArticleCategories | undefined = undefined;
  export let submitText: string = "Search content";
  export let restrictFields: SearchRestrictFields = {
    limit: { disabled: true, text: "testing" },
  };

  let loading = false;

  $: queryString = toUrl(searchQuery);
</script>

<form
  action="/news/search"
  method="get"
  class="h-full"
  on:submit={async (e) => {
    if (callback) {
      e.preventDefault();
      loading = true;
      await callback(searchQuery);
      loading = false;
    }
  }}
>
  <TwoHalfs>
    <svelte:fragment slot="first">
      <MajorSection title="Select Sources">
        <SourceSelect
          {sourceCategories}
          bind:selectedSources={searchQuery.sources}
          restrict={restrictFields.sources ?? { disabled: false, text: "" }}
        />
      </MajorSection>

      <hr
        class="sm:mb-8 mb-3 mt-3 border-tertiary-500 dark:border-surface-400 @5xl/full:hidden"
      />
    </svelte:fragment>
    <svelte:fragment slot="last">
      <MajorSection title="Search Query">
        <SearchPanel {searchQuery} {restrictFields} />

        <hr
          class="sm:mb-8 mb-3 mt-3 border-tertiary-500 dark:border-surface-400 @5xl/full:hidden"
        />

        <section class="flex gap-4 mx-4">
          {#if loading}
            <div
              class="button grow flex justify-center items-center"
              title="Loading..."
            >
              <Fa icon={faSpinner} class="text-xl animate-spin" />
            </div>
          {:else}
            <button class="btn grow">{submitText}</button>
          {/if}

          <div class="flex shrink-0 w-fit side-buttons">
            <slot name="side-buttons">
              <button
                type="button"
                class="btn"
                on:click={() => {
                  createItem(
                    "New Feed",
                    sanitizeQuery(searchQuery),
                    "feed",
                    "current"
                  );
                }}><Fa icon={faPlus} /></button
              >

              <a
                href="{PUBLIC_API_BASE}/articles/search/export?{queryString}"
                download="true"
                class="btn"
              >
                <Fa icon={faDownload} />
              </a>

              <button
                type="button"
                class="btn"
                on:click={() => (searchQuery = getStandardSearch())}
              >
                <Fa icon={faArrowsRotate} />
              </button>
            </slot>
          </div>
        </section>
      </MajorSection>
    </svelte:fragment>
  </TwoHalfs>
</form>

<style lang="postcss">
  section {
    :global(button),
    :global(a),
    :global(div.button) {
      @apply border border-tertiary-700
			h-16 p-2
			font-light dark:font-bold;
    }

    div.side-buttons {
      :global(button),
      :global(a) {
        @apply w-14 sm:w-16 h-16;

        :global(svg) {
          @apply opacity-70 text-sm;
        }
      }
    }
  }
</style>
