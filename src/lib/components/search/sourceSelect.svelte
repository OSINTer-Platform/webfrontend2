<script lang="ts">
    import Search from '$com/utils/search.svelte';

    import type { ArticleCategories } from '$shared/types/api';

    import Fa from 'svelte-fa/src/fa.svelte';
    import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons/index';
    import Loader from '$com/loader.svelte';
    import { onMount } from 'svelte';
    import { PUBLIC_API_BASE } from '$env/static/public';

    export let sourceCategories: ArticleCategories | undefined;
    export let selectedSources: string[] = [];
    let sourceSearch: string = '';

    $: allSelected =
        sourceCategories &&
        selectedSources.length == Object.keys(sourceCategories).length;
    $: noneSelected = selectedSources.length == 0;

    onMount(async () => {
        if (!sourceCategories) {
            const r = await fetch(`${PUBLIC_API_BASE}/articles/categories`);
            if (r.ok) {
                sourceCategories = await r.json();
            }
        }
    });
</script>

<div
    class="
	flex
	p-4
	gap-4
"
>
    <Search
        bind:value={sourceSearch}
        placeholder={'Filter sources...'}
        inputClass={'w-26'}
        containerClass="grow"
    />

    <button
        type="button"
        on:click={() => (selectedSources = [])}
        class="
		font-semibold
		text-xs
		@lg/half:text-base
		{noneSelected || !sourceCategories
            ? 'cursor-not-allowed opacity-75 text-surface-400 dark:text-white/80'
            : 'text-primary-400'}
	">Remove Selections ({selectedSources.length})</button
    >
    <button
        type="button"
        on:click={() => {
            if (sourceCategories) {
                selectedSources = Object.keys(sourceCategories);
            }
        }}
        class="
		font-semibold
		text-xs
		@lg/half:text-base
		{allSelected || !sourceCategories
            ? 'cursor-not-allowed opacity-75 text-surface-400 dark:text-white/80'
            : 'text-primary-400'}
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
    {#if sourceCategories}
        {#each Object.entries(sourceCategories) as [profileName, { name, image, url }]}
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

				{selected
                            ? 'bg-primary-300/30 dark:bg-primary-500/30'
                            : 'hover:bg-surface-200 dark:hover:bg-surface-500'}
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
						dark:text-white
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
						dark:text-white/75
						dark:font-medium

						hover:font-medium
						dark:hover:text-white
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
    {:else}
        <Loader />
    {/if}
</ul>
