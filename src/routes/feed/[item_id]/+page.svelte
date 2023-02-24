<script lang="ts">
    import type { PageData } from './$types';
    import List from '$com/article-list/main.svelte';

    import Fa from 'svelte-fa/src/fa.svelte';
	import {
        faBars, faDownload, faPenToSquare, type IconDefinition,
    } from '@fortawesome/free-solid-svg-icons/index';

    import { config } from '$shared/config';
    import ListMenu from '$com/listMenu.svelte';

    export let data: PageData;

	let modOptions: Array<{
		text: string;
		icon: IconDefinition;
		action?: Function;
		route?: string;
	}>

	$: modOptions = [
		{
			text: "Download",
			icon: faDownload,
			route: `${config.apiRoot}/user-items/${data.currentItem._id}/export`,
		},
		{
			text: `Modify ${data.currentItem.type}`,
			icon: faPenToSquare,
			action: () => {},
		},
	]

	const btnClass = "btn p-2 text-lg"
	
</script>


<main class="
	flex
	flex-col
	items-stretch
">
	<aside class="
		bg-surface-500/30
		p-12
	">
		<header class="flex justify-between">
			<section class="flex items-end gap-6">
				<h1 class="text-5xl">{data.currentItem.name}</h1>
				<span class="
					p-2
					rounded-full

					bg-surface-900
					text-surface-50

					text-xs
					font-bold
					capitalize
				">{data.currentItem.type}</span>
			</section>

			<section class="flex items-end">
				<ListMenu listOptions={[modOptions]}>
					<button class="{btnClass} xl:hidden lg:block md:hidden block">
						<Fa icon={faBars}/>
					</button>
				</ListMenu>

				<div class="xl:flex lg:hidden md:flex hidden gap-4">
					{#each modOptions as {text, icon, route, action}}
						{#if route}
							<a href="{route}" title="{text}" class="{btnClass}"><Fa icon={icon}/></a>
						{:else if action}
							<button on:click={action} title="{text}" class="{btnClass}"><Fa icon={icon}/></button>
						{/if}
					{/each}
				</div>
			</section>
		</header>
	</aside>

	<div class="
		overflow-auto
		bg-surface-100
	">
		<List articles={data.articles} />
	</div>
</main>
