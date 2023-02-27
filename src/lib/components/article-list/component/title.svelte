<script lang="ts">
    import { getTimespan } from '$lib/common';
    import type { ArticleBase } from '$shared/types';
    import SvelteMarkdown from 'svelte-markdown';

    export let articles: Array<ArticleBase>;
</script>

<div
    class="
	flex
	flex-col

	w-full
"
>
    {#each articles as article}
        <a
            href={`/feed/article/${article.id}`}
            class="
			flex
			items-center
			gap-4

			md:p-2
			p-1

			border-tertiary-500
			border-t

			hover:bg-surface-50
		"
        >
            <p
                class="
			hidden
			lg:hidden

			xl:block
			md:block

			truncate
			text-xs
			font-light

			w-1/12
			shrink-0
		"
            >
                {article.source}
            </p>
            <div
                class="
			flex
			flex-row
			gap-2

			shrink
			grow
			overflow-hidden
		"
            >
                <h1
                    class="
				text-sm
				md:text-base

				truncate
				font-semibold
				shrink-0

				[&>strong]:font-semibold
				[&>strong]:text-primary-600
			"
                >
                    <SvelteMarkdown source={article.title} isInline />
                </h1>

                <p
                    class="
				text-xs
				md:text-sm
				truncate
				leading-6
				text-tertiary-800

				[&>strong]:font-semibold
				[&>strong]:text-primary-400
			"
                >
                    <SvelteMarkdown source={article.title} isInline />
                </p>
            </div>
            <time
                title={article.publish_date}
                class="text-xs font-extralight shrink-0"
                >{getTimespan(article.publish_date)}</time
            >
        </a>
    {/each}
</div>
