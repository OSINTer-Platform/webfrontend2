<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import SvelteMarkdown from 'svelte-markdown';

    import Link from './link.svelte';
    import CollectionList from './collectionList.svelte';

    import { getTimespan } from '$lib/common/math';
    import { faStar } from '@fortawesome/free-regular-svg-icons';

    import type { ArticleBase } from '$shared/types/api';
    import type { Collection } from '$shared/types/userItems';
    import type { Writable } from 'svelte/store';

    export let userCollections: Writable<{ [key: string]: Collection }>;

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
            <div
                on:click|preventDefault|stopPropagation
                on:keydown|preventDefault|stopPropagation
                class="
				relative
				w-full md:w-32
				max-h-80
				aspect-video md:aspect-square
				drop-shadow-lg

				[&:hover>div]:opacity-100
			"
            >
                {#if Object.values($userCollections).length > 0}
                    <div
                        class="
						flex justify-center items-center
						h-full w-full
						bg-black/75 opacity-0

						transition-opacity

						absolute z-10
						[&:focus-within>button>svg]:text-primary-500
					"
                    >
                        <CollectionList
                            {userCollections}
                            articleId={article.id}
                            class="top-10"
                            btnClass="pb-2"
                        >
                            <Fa
                                icon={faStar}
                                class="
								hover:text-primary-500
								transition-colors
								text-white/90 text-4xl
							"
                            />
                        </CollectionList>
                    </div>
                {/if}
                <img
                    class="
						w-full h-full
						object-cover
						rounded-md
					"
                    loading="lazy"
                    alt="Article Overview"
                    src={article.image_url}
                />
            </div>

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
