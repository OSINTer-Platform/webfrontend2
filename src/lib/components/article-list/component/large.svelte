<script lang="ts">
    import type { ArticleBase } from '$shared/types';

    export let article: ArticleBase;
</script>

<a
    href={`/feed/article/${article.id}`}
    class="
	grid
	grid-cols-[10rem_1fr]
"
>
    <img
        class="
		object-cover
		rounded-md

		w-32
		h-32
		drop-shadow-md
	"
        loading="lazy"
        alt="Article Overview"
        src={article.image_url}
    />

    <div>
        <div
            class="
			flex
			flex-row
			justify-between

			font-light
			text-sm
		"
        >
            <p>{article.source}</p>
            <time title={article.publish_date}>{article.publish_date}</time>
        </div>

        <h2
            class="
			text-2xl
			font-semibold
		"
        >
            {article.title}
        </h2>

        <p
            class="
			text-gray-600
		"
        >
            {article.description}
        </p>
    </div>
</a>
