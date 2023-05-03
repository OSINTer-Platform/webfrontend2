<script lang="ts">
    import { config } from '$shared/config';
    import SvelteMarkdown from 'svelte-markdown';
    import type { PageData } from './$types';
    export let data: PageData;

    $: postData = data.currentPost.data;
    $: readableDate = postData.date.toLocaleString();
</script>

<svelte:head>
    <title>OSINTer Blog - {postData.title}</title>
    <meta property="og:title" content="OSINTer Blog - {postData.title}" />
    <meta property="og:description" content={postData.description} />
    <meta
        property="og:image"
        content={postData.image ?? config.images.fullLogo}
    />
    <meta property="og:url" content="https://osinter.dk/blog/{postData.id}" />

    <meta property="og:type" content="article" />
    <meta
        property="article:published_time"
        content={postData.date.toISOString()}
    />
    <meta property="article:author" content={postData.author} />
</svelte:head>

<article
    class="
	flex
	flex-col

	min-h-full

	!max-w-4xl
	m-auto
	p-12

	prose-sm
	md:prose

	prose-h1:font-bold
	prose-h1:text-5xl

	prose-hr:border-surface-300

"
>
    <span class="not-prose">
        <div
            class="
			flex
			justify-between
			mb-6

			text-surface-400
			italic
			text-sm
		"
        >
            <p>{postData.author}</p>
            <time>{readableDate}</time>
        </div>

        <h1
            class="md:font-bold md:text-5xl md:text-justify text-4xl font-semibold"
        >
            {postData.title}
        </h1>
        <p class="text-lg font-light italic mb-8">{postData.description}</p>

        {#if postData.image}
            <img src={postData.image} alt="Article description" />
        {:else}
            <img
                src={config.images.fullLogo}
                alt="Article description"
                class="aspect-[2/1] w-full object-cover"
            />
        {/if}
    </span>

    <SvelteMarkdown source={data.currentPost.content} />
</article>
