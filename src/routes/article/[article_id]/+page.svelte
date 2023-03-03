<script lang="ts">
    import type { PageData } from './$types';
    import ArticleRender from '$com/articleRender/main.svelte';

    export let data: PageData;
</script>

<section
    class="
	flex
	flex-row

	p-12
	gap-12
"
>
    <article
        class="
		flex
		flex-col

		max-w-full
		min-w-0

		overflow-x-hidden
	"
    >
        <ArticleRender article={data.article} header={false} />
    </article>

    <div
        class="
		w-96

		h-20
		bg-primary-500/25

		shrink-0

		sticky
		top-10

		hidden
		2xl:block
	"
    >
        Placeholder
    </div>
</section>
