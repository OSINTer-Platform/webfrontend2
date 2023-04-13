<script lang="ts">
    import type { ArticleCategories } from '$shared/types/api';

    import Fa from 'svelte-fa/src/fa.svelte';
    import {
        faCheck,
        faMagnifyingGlass,
        faPlus,
    } from '@fortawesome/free-solid-svg-icons/index';

    export let sourceOptions: ArticleCategories;
    export let selectedSources: string[] = [];
    let sourceSearch: string = '';

    $: allSelected =
        selectedSources.length == Object.keys(sourceOptions).length;
    $: noneSelected = selectedSources.length == 0;
</script>

<div
    class="
	flex
	p-4
	gap-4
"
>
    <div class="grow search-field">
        <label for="source-search" class="">
            <Fa icon={faMagnifyingGlass} />
        </label>

        <input
            bind:value={sourceSearch}
            id="source-search"
            type="text"
            placeholder="Search sources..."
            class="w-26"
        />
    </div>

    <button
        type="button"
        on:click={() => (selectedSources = [])}
        class="
		text-tertiary-700
		font-semibold
		text-xs
		@lg/half:text-base
		{noneSelected ? 'cursor-not-allowed' : '!text-primary-500'}
	">Remove Selections ({selectedSources.length})</button
    >
    <button
        type="button"
        on:click={() => (selectedSources = Object.keys(sourceOptions))}
        class="
		text-tertiary-700
		font-semibold
		text-xs
		@lg/half:text-base
		{allSelected ? 'cursor-not-allowed' : '!text-primary-500'}
	">Select All</button
    >
</div>

<ul
    class="
	space-y-2
	p-4
	overflow-x-hidden
	overflow-auto
"
>
    {#each Object.entries(sourceOptions) as [profileName, { name, image, url }]}
        {@const visible =
            sourceSearch.length == 0 ||
            name.toLowerCase().includes(sourceSearch)}
        {@const selected = selectedSources.includes(profileName)}

        <li>
            <input
                bind:group={selectedSources}
                type="checkbox"
                id="{profileName}-checkbox"
                name="source_category"
                value={profileName}
                class="hidden"
            />

            {#if visible}
                <label
                    for="{profileName}-checkbox"
                    class="
			flex
			items-center
			gap-2

			cursor-pointer

			{selected ? 'bg-primary-300/30' : 'hover:bg-surface-200'}
		"
                >
                    <img
                        alt="{name} icon"
                        src={image}
                        class="
				w-12
				aspect-square

				object-contain
				overflow-hidden
				shrink-0

				rounded-sm
				drop-shadow-lg

				bg-white

				m-4
			"
                    />

                    <div class="grow">
                        <h3
                            class="
					font-semibold
					@:md/half:text-xl
				"
                        >
                            {name}
                        </h3>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="
					font-light
					text-tertiary-900

					hover:font-medium
					text-xs
					@md/half:text-base
				">{url.replace('https://', '')}</a
                        >
                    </div>

                    <div
                        class="
				m-4
				p-2
				rounded-full

				{selected ? 'bg-primary-500' : 'border border-tertiary-500'}
			"
                    >
                        <Fa
                            icon={selected ? faCheck : faPlus}
                            class="{selected
                                ? 'text-primary-100'
                                : 'text-tertiary-900'} text-lg"
                        />
                    </div>
                </label>
            {/if}
        </li>
    {/each}
</ul>
