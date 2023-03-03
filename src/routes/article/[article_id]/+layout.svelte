<script lang="ts">
    import ModList from '$com/article-list/header/modList.svelte';
    import DetailList from '$com/article-list/header/detailList.svelte';

    import type { Article, ArticleTags } from '$shared/types/api';
    import type { HeaderModOptions } from '$shared/types/internal';
    import type { LayoutData } from './$types';

    import {
        faClipboard,
        faPaste,
    } from '@fortawesome/free-regular-svg-icons/index';

    import {
        faDownload,
		faXmark
    } from '@fortawesome/free-solid-svg-icons/index';

    import { config } from '$shared/config';
    import { fullArticles } from '$shared/state';
    import { redirect } from '@sveltejs/kit';
    import { goto } from '$app/navigation';

	export let data: LayoutData;

	function getTags(tags: ArticleTags) {
		const extractedTags: {[key: string]: string[]} = {}

		if (tags?.automatic && tags.automatic.length > 1) {
			extractedTags["Automatic Tags"] = tags.automatic
		}

		if (tags?.interresting && Object.keys(tags.interresting).length > 0) {
			for (const [key, {results}] of Object.entries(tags.interresting)) {
				extractedTags[key.toUpperCase()] = results
			}
		}

		return extractedTags
	}

	$: overviews = [ 
		{ "Sources" : [`Medium: ${data.article.source}`, `Author: ${data.article.author}`,], },
		{ "Dates" : [`Published: ${data.article.publish_date}`, `Scraped: ${data.article.inserted_at}`], },
	]

	$: tags = getTags(data.article.tags)

    let modOptions: Array<HeaderModOptions>;

    $: modOptions = [
        {
            text: `Copy raw`,
            icon: faClipboard,
            action: () => navigator.clipboard.writeText(data.article.content),
        },
        {
            text: `Copy formatted`,
            icon: faPaste,
            action: () => navigator.clipboard.writeText(data.article.formatted_content),
        },
        {
            text: 'Download MD',
            icon: faDownload,
            route: `${config.apiRoot}/articles/${data.article.id}/export`,
        },
        {
            text: 'Close article',
            icon: faXmark,
            action: () => {
				fullArticles.update((content) => {
					delete content[data.article.id]
					return content
				})
				goto('/article')
			},
        },
    ];
</script>

<main
    class="
	flex
	flex-col
	grow

	items-stretch
	overflow-y-auto
	overflow-x-hidden

	bg-surface-50
"
>
	<aside class="
		bg-surface-400/30

		p-6
		sm:p-12
		!pb-4
	"
    >
        <header class="flex justify-between mb-3">
            <h1 class="sm:text-5xl text-3xl xl:max-w-5xl">
                {data.article.title}
            </h1>

            <section class="flex items-start shrink-0">
                <ModList {modOptions} />
            </section>
        </header>

        <p class="italic font-light">{data.article.description}</p>
		
		<hr class="my-4 border-tertiary-700/50" />
		{#each overviews as overview}
			<DetailList options={overview} mono={false} />
			<hr class="my-4 border-tertiary-700/50" />
		{/each}

		{#if Object.values(tags).length > 0}
			<DetailList options={tags} mono={true} />
			<hr class="my-4 border-tertiary-700/50" />
		{/if}
	</aside>
	
	<slot/>
</main>
