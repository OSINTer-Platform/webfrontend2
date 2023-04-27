<script lang="ts">
    import MajorSection from './majorSection.svelte';
    import SearchPanel from './searchQuery.svelte';
    import SourceSelect from './sourceSelect.svelte';
    import Fa from 'svelte-fa/src/fa.svelte';

    import {
        faArrowsRotate,
        faDownload,
        faPlus,
    } from '@fortawesome/free-solid-svg-icons';
    import type { SearchQuery } from '$shared/types/api';
    import type { PageData } from './$types';

    import { config, getStandardSearch } from '$shared/config';

    export let data: PageData;

    export let searchQuery: SearchQuery = getStandardSearch();
</script>

<svelte:head>
    <title>OSINTer - Search in articles</title>
    <meta
        property="og:title"
        content="OSINTer - Search for available articles"
    />
    <meta
        property="og:description"
        content="Here it's possible to search in the articles stored in this instance of OSINTer"
    />
    <meta property="og:image" content={config.images.fullLogo} />
    <meta property="og:url" content="https://osinter.dk/search" />
    <meta property="og:type" content="website" />
</svelte:head>

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
            <slot name="main-button">
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
                <slot name="side-buttons">
                    <!--
                    <button
                        on:click={() => {}}
                        class="
							btn
							h-16
							w-16
						"><Fa icon={faPlus} class="opacity-70 text-sm" /></button
                    >
					-->

                    <button
                        formaction="{config.apiRoot}/articles/search/export"
                        class="
							btn
							h-16
							w-16
						"><Fa icon={faDownload} class="opacity-70 text-sm" /></button
                    >
                    <button
                        type="button"
                        on:click={() => (searchQuery = getStandardSearch())}
                        class="
							btn
							h-16
							w-16
						"><Fa icon={faArrowsRotate} class="opacity-70 text-sm" /></button
                    >
                </slot>
            </div>
        </section>
    </div>
</form>

<style lang="scss">
    button {
        @apply border border-tertiary-700;
    }
</style>
