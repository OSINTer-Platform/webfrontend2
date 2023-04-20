<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown';
    import type { PageData } from './$types';
    export let data: PageData;

    $: postData = data.currentPost.data;
    $: readableDate = new Date(postData.date).toLocaleString();
</script>

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

    <h1 class="md:font-bold md:text-5xl md:text-justify text-4xl font-semibold">
        {postData.title}
    </h1>
    <p class="text-lg font-light italic mb-8">{postData.description}</p>

    {#if postData.image}
        <img src={postData.image} alt="Article description" />
    {:else}
        <img
            src="https://gitlab.com/osinter/osinter/-/raw/master/logo/full.png"
            alt="Article description"
            class="aspect-[2/1] w-full object-cover"
        />
    {/if}
</span>

<SvelteMarkdown source={data.currentPost.content} />
