<script lang="ts">
    import type { Article, ArticleCategories } from '$shared/types/api';
    import Modal from './modal.svelte';
    import ArticleRender from '$com/articleRender/main.svelte';

    export let article: Article;
    export let articleCategories: ArticleCategories;
</script>

<Modal class="w-[80vw] h-[90vh] bg-surface-200 dark:bg-surface-700">
    <article
        class="
		bg-surface-100
		dark:bg-surface-800

		py-8
		px-16
		mx-auto

		max-w-[100ch]
	"
    >
        <ArticleRender {article} {articleCategories} header={true} />
    </article>
</Modal>

<style lang="postcss">
</style>
