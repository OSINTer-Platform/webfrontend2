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
  } from "@fortawesome/free-solid-svg-icons";

  import type { ArticleCategories, SearchQuery } from "$shared/types/api";

  import { PUBLIC_API_BASE } from "$env/static/public";
  import { getStandardSearch } from "$shared/config";
  import { createItem, sanitizeQuery } from "$lib/common/userItems";

  export let searchQuery: SearchQuery = getStandardSearch();
  export let sourceCategories: ArticleCategories | undefined = undefined;
</script>

<TwoHalfs>
  <svelte:fragment slot="first">
    <MajorSection title="Select Sources">
      <SourceSelect
        {sourceCategories}
        bind:selectedSources={searchQuery.sources}
      />
    </MajorSection>

    <hr
      class="sm:mb-8 mb-3 mt-3 text-tertiary-500 dark:text-surface-400 @5xl/full:hidden"
    />
  </svelte:fragment>
  <svelte:fragment slot="last">
    <MajorSection title="Search Query">
      <SearchPanel {searchQuery} />

      <hr
        class="sm:mb-8 mb-3 mt-3 text-tertiary-500 dark:text-surface-400 @5xl/full:hidden"
      />

      <section class="flex gap-4 mx-4">
        <slot name="main-button" />

        <div class="flex shrink-0 w-fit side-buttons">
          <slot name="side-buttons">
            <button
              class="btn"
              on:click={() => {
                createItem(
                  "New feed",
                  sanitizeQuery(searchQuery),
                  "feed",
                  "current"
                );
              }}><Fa icon={faPlus} /></button
            >

            <button
              class="btn"
              formaction="{PUBLIC_API_BASE}/articles/search/export"
            >
              <Fa icon={faDownload} />
            </button>

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

<style lang="postcss">
  section {
    :global(button) {
      @apply border border-tertiary-700
			h-16 p-2
			font-light dark:font-bold;

      :global(svg) {
        @apply opacity-70 text-sm;
      }
    }

    div.side-buttons {
      :global(button) {
        @apply w-14 sm:w-16 h-16;
      }
    }
  }
</style>
