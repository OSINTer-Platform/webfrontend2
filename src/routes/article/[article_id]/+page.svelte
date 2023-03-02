<script lang="ts">
    import type { PageData } from './$types';
    import ArticleRender from '$com/articleRender/main.svelte'

    export let data: PageData;
</script>

<article class="
	flex
	flex-col

	max-w-6xl
	mx-auto

	overflow-auto
">
	<ArticleRender article={data.article} header={false}/>
</article>

<style>
</style>
