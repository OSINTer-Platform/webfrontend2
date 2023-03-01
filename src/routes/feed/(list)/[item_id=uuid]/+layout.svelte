<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData

    import { config } from '$shared/config';
    import ListMenu from '$com/listMenu.svelte';
    import ItemDescriptor from '../itemDescriptor/main.svelte';
    import Search from '../search.svelte';
    import Tabs from '$com/tabs.svelte';


    import Fa from 'svelte-fa/src/fa.svelte';
    import {
        faBars,
        faDownload,
        faPenToSquare,
        type IconDefinition,
    } from '@fortawesome/free-solid-svg-icons/index';
    import { articleRender, localSearch } from '$shared/state';


    let modOptions: Array<{
        text: string;
        icon: IconDefinition;
        action?: Function;
        route?: string;
    }>;

    $: modOptions = [
        {
            text: 'Download',
            icon: faDownload,
            route: `${config.apiRoot}/user-items/${data.currentItem._id}/export`,
        },
        {
            text: `Modify ${data.currentItem.type}`,
            icon: faPenToSquare,
            action: () => {},
        },
	];

    const btnClass = 'btn p-2 text-lg';
</script>

<aside
	class="
	bg-surface-500/30

	p-6
	sm:p-12

	!pb-0
"
>
	<header class="flex justify-between sm:mb-10 mb-4">
		<section class="flex items-end gap-6">
			<h1 class="sm:text-5xl text-3xl">{data.currentItem.name}</h1>
			<span
				class="
				p-2
				rounded-full

				bg-surface-900
				text-surface-50

				text-xs
				font-bold
				capitalize
			">{data.currentItem.type}</span
			>
		</section>

		<section class="flex items-end">
			<ListMenu listOptions={[modOptions]}>
				<button
					class="{btnClass} xl:hidden lg:block md:hidden block"
				>
					<Fa icon={faBars} />
				</button>
			</ListMenu>

			<div class="xl:flex lg:hidden md:flex hidden gap-4">
				{#each modOptions as { text, icon, route, action }}
					{#if route}
						<a href={route} title={text} class={btnClass}
							><Fa {icon} /></a
						>
					{:else if action}
						<button
							on:click={action}
							title={text}
							class={btnClass}><Fa {icon} /></button
						>
					{/if}
				{/each}
			</div>
		</section>
	</header>

	<ItemDescriptor
		currentItem={data.currentItem}
		categories={data.sourceCategories}
	/>

	<Search bind:articleSearch={$localSearch}/>

	<Tabs
		bind:selected={$articleRender}
		options={{ Large: 'large', 'Title-View': 'title' }}
	/>
</aside>

<slot/>
