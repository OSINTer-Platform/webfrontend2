<script lang="ts">
    import Search from '$com/utils/search.svelte';
    import Tabs from '$com/tabs.svelte';

    import type { HeaderModOptions } from '$shared/types/internal';

    import { articleListRender } from '$state/state';
    import ModList from './modList.svelte';

    export let title: string;
    export let badge: string = '';
    export let description: string = '';

    export let searchValue: string = '';

    export let modOptions: Array<HeaderModOptions> = [];
</script>

<aside
    class="
	bg-surface-400/30
	dark:bg-surface-800

	dark:border-b
	dark:border-surface-400

	p-6
	sm:p-12

	!pb-0
"
>
    <header
        class="flex justify-between {description ? 'sm:mb-2' : 'sm:mb-10 mb-4'}"
    >
        <section class="flex items-center gap-3 sm:gap-6">
            <h1 class="sm:text-5xl text-3xl dark:text-white">{title}</h1>
            {#if badge}
                <span
                    class="
					px-2
					py-1
					
					sm:mt-3
					
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

        <section class="flex items-end">
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

    <slot />

    <Search
        bind:value={searchValue}
        placeholder={'Filter displayed articles'}
        containerClass={'w-full my-6'}
    />

    <Tabs
        bind:selected={$articleListRender}
        options={{ Large: 'large', 'Title-View': 'title' }}
    />
</aside>
