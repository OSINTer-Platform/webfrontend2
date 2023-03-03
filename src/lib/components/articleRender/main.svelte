<script lang="ts">
    import type { Article } from '$shared/types/api';

    import SvelteMarkdown from 'svelte-markdown';

    export let article: Article;
    export let header: Boolean = true;

    $: readableDate = new Date(article.publish_date).toLocaleString();
</script>

{#if header}
    <div class="flex justify-between items-center">
        <time class="block text-sm opacity-50">{readableDate}</time>
        <span class="text-xs opacity-50">Read {article.read_times} times</span>
    </div>
    <h1 class="text-4xl">{article.title}</h1>
    <h4 class="">
        From {article.source} - Written by {article.author} - -
    </h4>
{/if}

<img alt="Main Article" src={article.image_url} class="aspect-video mb-6" />

{#if header}
    <h3>{article.description}</h3>
{/if}

<div class="article-content text-justify">
    <SvelteMarkdown source={article.formatted_content} />
</div>

<hr class="text-tertiary-700/25 mb-8" />

<button
    on:click={() => window.open(article.url, '_blank')}
    class="
	p-6

	uppercase
	font-bold
	text-tertiary-800

	border
	border-tertiary-700/50
	rounded-sm

	btn
	hover:bg-primary-800/10
	hover:border-primary-600/30
"
>
    Read article on website
</button>

<hr class="text-tertiary-700/25 my-8" />

<style lang="scss">
    div.article-content {
        :global(*) {
            @apply max-w-full mb-6;
        }

        :global(ul) {
            @apply list-disc list-inside;
        }

        :global(li) {
            @apply mb-2 italic;
        }

        :global(span),
        :global(p),
        :global(a),
        :global(li) {
            @apply font-light;
        }

        :global(h1) {
            @apply text-4xl;
        }

        :global(h2) {
            @apply text-3xl font-normal;
        }

        :global(h3) {
            @apply text-2xl font-light;
        }

        :global(h4),
        :global(h5),
        :global(h6) {
            @apply text-xl font-thin;
        }

        :global(a) {
            @apply underline;
        }

        :global(h2) {
        }

        :global(code) {
            @apply break-all whitespace-normal font-mono font-normal text-sm text-black;
        }

        :global(p) {
            :global(img) {
                @apply mb-1;

                & ~ :global(p),
                & ~ :global(strong),
                & ~ :global(em) {
                    @apply block mx-auto mb-1 w-max italic;
                }

                & ~ :global(br) {
                    @apply hidden;
                }

                & ~ :global(*):last-child {
                    @apply mb-8;
                }
            }
        }

        :global(img) {
            @apply rounded-lg w-full;
        }
    }
</style>