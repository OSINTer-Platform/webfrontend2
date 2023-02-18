<script lang="ts">
    import type { PageData } from './$types';
    import SvelteMarkdown from 'svelte-markdown';

    export let data: PageData;

    $: source = data.article.formatted_content;
</script>

<div class="article-content">
    <h1 class="article-title">{data.article.title}</h1>
    <h4 class="article-details">
        From {data.article.source} - Written by {data.article.author} - {data
            .article.publish_date} - Read {data.article.read_times} times.
    </h4>
    <img alt="Main Article" src={data.article.image_url} />
    <h3>{data.article.description}</h3>
    <SvelteMarkdown {source} />
    <button on:click={() => window.open(data.article.url, '_blank')}>
        Read article on website
    </button>

    <hr />
</div>
