<script lang="ts">
    import MajorSection from './majorSection.svelte';
    import SearchPanel from './searchQuery.svelte';
    import SourceSelect from './sourceSelect.svelte';

    import type { ArticleCategories, SearchQuery } from '$shared/types/api';

    import { getStandardSearch } from '$shared/config';

    export let searchQuery: SearchQuery = getStandardSearch();
    export let sourceCategories: ArticleCategories;
</script>

<div
    class="
	flex
	flex-col
	@5xl:flex-row

	overflow-y-auto


	px-2
	py-4
	sm:p-8

	h-full
	w-full
"
>
    <div
        class="
		flex
		flex-col
		shrink-0

		w-full
		h-fit

		@5xl:h-full
		@5xl:w-1/2
		@5xl:overflow-auto

		border-tertiary-500
		dark:border-surface-400
		@5xl:border-r
		@5xl:pr-8

		@container/half
	"
    >
        <MajorSection title="Select Sources">
            <SourceSelect
                sourceOptions={sourceCategories}
                bind:selectedSources={searchQuery.source_category}
            />
        </MajorSection>

        <hr
            class="sm:mb-8 mb-3 mt-3 text-tertiary-500 dark:text-surface-400 @5xl/full:hidden"
        />
    </div>

    <div
        class="
		flex
		flex-col

		w-full
		@5xl:w-1/2
		@5xl:pl-8

		@container/half
	"
    >
        <MajorSection title="Search Query">
            <SearchPanel {searchQuery} />

            <hr
                class="sm:mb-8 mb-3 mt-3 text-tertiary-500 dark:text-surface-400 @5xl/full:hidden"
            />

            <section class="flex gap-4 mx-4">
                <slot name="main-button" />

                <div class="flex shrink-0 w-fit side-buttons">
                    <slot name="side-buttons" />
                </div>
            </section>
        </MajorSection>
    </div>
</div>

<style lang="postcss">
    section {
        :global(button) {
            @apply border border-tertiary-700
			h-16 w-16
			font-light dark:font-bold;

            :global(svg) {
                @apply opacity-70 text-sm;
            }
        }

        div.side-buttons {
            :global(button) {
                @apply w-16;
            }
        }
    }
</style>
