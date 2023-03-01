<script lang="ts">
    import Search from './search.svelte';
    import Tabs from '$com/tabs.svelte';

    import type { HeaderModOptions } from '$shared/types/internal';

    import { articleRender, localSearch } from '$shared/state';
    import ModList from './modList.svelte';

    export let title: string;
    export let badge: string = '';
    export let description: string = '';

    export let modOptions: Array<HeaderModOptions> = [];
</script>

<aside
    class="
	bg-surface-400/30

	p-6
	sm:p-12

	!pb-0
"
>
    <header
        class="flex justify-between {description ? 'mb-3' : 'sm:mb-10 mb-4'}"
    >
        <section class="flex items-end gap-6">
            <h1 class="sm:text-5xl text-3xl">{title}</h1>
            {#if badge}
                <span
                    class="
					p-2
					rounded-full

					bg-surface-900
					text-surface-50

					text-xs
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
        <p class="italic font-light">{description}</p>
    {/if}

    <slot />

    <Search bind:articleSearch={$localSearch} />

    <Tabs
        bind:selected={$articleRender}
        options={{ Large: 'large', 'Title-View': 'title' }}
    />
</aside>
