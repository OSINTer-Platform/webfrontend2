<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown';
    import { getTimespan } from '$lib/common/math';
    import type { ArticleBase } from '$shared/types/api';
    import Link from './link.svelte';

    export let articles: Array<ArticleBase>;
</script>

<div
    class="
	flex
	flex-col

	space-y-8
	sm:space-y-4

	overflow-auto
"
>
    {#each articles as article}
        <hr class="text-tertiary-500 dark:text-surface-500" />

        <Link
            articleId={article.id}
            class="
		grid
		grid-cols-1
		md:grid-cols-[auto_1fr]

		gap-8

		items-center

		p-3
		sm:p-6

		hover:bg-surface-50
		dark:hover:bg-surface-500
	"
        >
            <img
                class="
			object-cover
			rounded-md

			w-full
			md:w-32


			lg:max-h-80
			max-h-80

			aspect-video
			md:aspect-square



			drop-shadow-lg
		"
                loading="lazy"
                alt="Article Overview"
                src={article.image_url}
            />

            <div
                class="
			flex
			flex-col

			justify-center
		"
            >
                <div
                    class="
				flex
				flex-row
				justify-between

				font-light
				text-xs
				dark:text-white

				mb-1
			"
                >
                    <p>{article.source}</p>
                    <time title={article.publish_date}
                        >{getTimespan(article.publish_date)}</time
                    >
                </div>

                <div>
                    <h2
                        class="
					sm:text-2xl
					text-xl
					dark:text-white

					font-semibold
					[&>strong]:font-semibold
					[&>strong]:text-primary-600
				"
                    >
                        <SvelteMarkdown source={article.title} isInline />
                    </h2>

                    <p
                        class="
					font-normal
					text-tertiary-900
					dark:text-white/80
					[&>strong]:font-semibold
					[&>strong]:text-primary-600
				"
                    >
                        <SvelteMarkdown source={article.description} isInline />
                    </p>
                </div>
            </div>
        </Link>
    {/each}
</div>
