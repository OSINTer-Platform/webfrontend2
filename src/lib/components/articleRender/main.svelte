<script lang="ts">
    import type { Article } from "$shared/types/api";


    import SvelteMarkdown from 'svelte-markdown';

	export let article: Article
	export let header: Boolean = true

	$: readableDate = (new Date(article.publish_date)).toLocaleString()
</script>

{#if header}
	<div class="flex justify-between items-center">
		<time class="block text-sm opacity-50">{readableDate}</time>
		<span class="text-xs opacity-50">Read {article.read_times} times</span>
	</div>
	<h1 class="text-4xl">{article.title}</h1>
	<h4 class="">
		From {article.source} - Written by {article.author} -  - 
	</h4>
{/if}

<img alt="Main Article" src={article.image_url} />
<h3>{article.description}</h3>
<SvelteMarkdown source={article.formatted_content} />
<button on:click={() => window.open(article.url, '_blank')}>
	Read article on website
</button>

<hr />

