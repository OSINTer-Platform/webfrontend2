<script lang="ts">
    import SvelteMarkdown from 'svelte-markdown';
    import { getTimespan } from '$lib/common';
    import type { ArticleBase } from '$shared/types';

    export let articles: Array<ArticleBase>;
</script>

<div
    class="
	flex
	flex-col

	space-y-4

	overflow-auto
"
>
    {#each articles as article}
        <hr class="text-tertiary-500" />

        <a
            href={`/feed/article/${article.id}`}
            class="
		grid
		xl:grid-cols-[auto_1fr]
		md:grid-cols-[auto_1fr]

		grid-cols-1
		lg:grid-cols-1

		gap-8

		items-center

		p-6

		hover:bg-surface-50
	"
        >
            <img
                class="
			object-cover
			rounded-md

			xl:w-32
			md:w-32

			lg:w-full
			w-full

			lg:max-h-80
			max-h-80

			xl:aspect-square
			md:aspect-square

			aspect-video


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
					[&>strong]:font-semibold
					[&>strong]:text-primary-600
				"
                    >
                        <SvelteMarkdown source={article.description} isInline />
                    </p>
                </div>
            </div>
        </a>
    {/each}
</div>
