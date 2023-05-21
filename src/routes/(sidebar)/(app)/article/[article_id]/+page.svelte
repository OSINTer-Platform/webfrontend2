<script lang="ts">
    import type { HeadingList } from '$lib/common/ToC';
    import type { PageData } from './$types';

    import ArticleRender from '$com/articleRender/main.svelte';

    export let data: PageData;
    $: article = data.article;

    let headings: HeadingList = [];
</script>

<svelte:head>
    <title>OSINTer - {article.title}</title>
    <meta property="og:title" content="OSINTer - {article.title}" />
    <meta property="og:description" content={article.description} />
    <meta property="og:image" content={article.image_url} />
    <meta property="og:url" content="https://osinter.dk/article/{article.id}" />
    <meta property="og:type" content="article" />
</svelte:head>

<section
    class="
	flex
	flex-row

	p-6
	sm:p-12
	gap-12
"
>
    <article
        class="
		flex
		flex-col

		max-w-full
		2xl:max-w-5xl
		2xl:mx-auto
		min-w-0

		overflow-x-hidden
	"
    >
        <ArticleRender bind:headings {article} header={false} />
    </article>

    {#if headings.length > 0}
        <div
            class="
			w-96
			max-h-screen
			overflow-x-auto

			shrink-0

			sticky
			top-4

			hidden
			2xl:flex
			flex-col

			dark:text-white
		"
        >
            <p
                class="
				pl-2
				font-bold
				text-lg
			"
            >
                In this article
            </p>
            {#each headings as heading}
                <a
                    href="#{heading.id}"
                    class="
					inline-flex items-center
					h-8 shrink-0
					px-2
					overflow-hidden truncate
					text-sm font-light
					rounded-md
					cursor-pointer
					hover:bg-primary-500/5
					ml-{3 * heading.depth}
					dark:font-medium
				"
                >
                    {heading.text}
                </a>
            {/each}
        </div>
    {/if}
</section>
