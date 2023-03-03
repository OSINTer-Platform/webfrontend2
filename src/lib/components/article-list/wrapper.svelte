<script lang="ts">
    import { articleListRender, localSearch } from '$shared/state';
    import { filterArticles } from '$lib/common';
    import type { ArticleBase } from '$shared/types/api';
    import List from './main.svelte';

    export let articles: ArticleBase[];
</script>

<div
    class="
	bg-surface-100

	p-6
	sm:p-12
"
>
    <List
        articles={filterArticles(articles, $localSearch)}
        layout={$articleListRender}
    />
</div>
