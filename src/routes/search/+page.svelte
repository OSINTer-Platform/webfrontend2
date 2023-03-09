<script lang="ts">
    import MajorSection from './majorSection.svelte';
    import SearchPanel from './searchQuery.svelte';
    import SourceSelect from './sourceSelect.svelte';
    import Fa from 'svelte-fa/src/fa.svelte';

    import {
        faArrowsRotate,
        faDownload,
        faPlus,
        type IconDefinition,
    } from '@fortawesome/free-solid-svg-icons';
    import type { SearchQuery } from '$shared/types/api';
    import type { PageData } from './$types';

    import { getStandardSearch } from '$shared/config';

    export let data: PageData;

    export let searchQuery: SearchQuery = getStandardSearch();

    export let miscActions: Array<{ icon: IconDefinition; action: Function }> =
        [
            {
                icon: faPlus,
                action: () => {},
            },
            {
                icon: faDownload,
                action: () => {},
            },
            {
                icon: faArrowsRotate,
                action: () => {},
            },
        ];
</script>

<form
    action="/feed/search"
    method="get"
    class="
	flex
	flex-col
	@5xl:flex-row

	overflow-auto


	p-8

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
		@5xl:border-r
		@5xl:pr-8

		@container/half
	"
    >
        <MajorSection title="Select Sources">
            <SourceSelect sourceOptions={data.sourceCategories} />
        </MajorSection>

        <hr class="mb-8 mt-3 text-tertiary-500 @5xl/full:hidden" />
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
        </MajorSection>

        <hr class="mb-8 mt-3 text-tertiary-500 @5xl/full:hidden" />

        <section class="flex gap-4 mx-4">
            <slot>
                <button
                    class="
					btn
					h-16
					grow

					font-light
				">Search Content</button
                >
            </slot>

            <div class="flex shrink-0 w-fit">
                {#each miscActions as { icon, action }}
                    <button
                        on:click={() => action()}
                        class="
						btn
						h-16
						w-16
					"><Fa {icon} class="opacity-70 text-sm" /></button
                    >
                {/each}
            </div>
        </section>
    </div>
</form>

<style lang="scss">
    button {
        @apply border border-tertiary-700;
    }
</style>
