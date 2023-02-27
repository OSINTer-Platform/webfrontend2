<script lang="ts">
    import type { PageData } from './$types';
    import List from '$com/article-list/main.svelte';

    import Fa from 'svelte-fa/src/fa.svelte';
    import {
        faBars,
        faDownload,
        faPenToSquare,
        faMagnifyingGlass,
        type IconDefinition,
    } from '@fortawesome/free-solid-svg-icons/index';

    import { config } from '$shared/config';
    import ListMenu from '$com/listMenu.svelte';
    import ItemDescriptor from './itemDescriptor/main.svelte';
    import Search from './search.svelte';
    import Tabs from '$com/tabs.svelte';

    export let data: PageData;

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

    let articleRendering: string = 'large';

    let articleSearch: string = '';

    $: visibleArticles =
        articleSearch.length > 0
            ? data.articles.filter((article) =>
                  Object.values(article).some((field) =>
                      field.toLowerCase().includes(articleSearch)
                  )
              )
            : data.articles;
</script>

<main
    class="
	flex
	flex-col
	items-stretch
	overflow-y-auto
	overflow-x-hidden

"
>
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

        <Search bind:articleSearch />

        <Tabs
            bind:selected={articleRendering}
            options={{ Large: 'large', 'Title-View': 'title' }}
        />
    </aside>

    <div
        class="
		bg-surface-100

		p-6
		sm:p-12
	"
    >
        <List articles={visibleArticles} layout={articleRendering} />
    </div>
</main>
