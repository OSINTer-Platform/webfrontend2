<script lang="ts">
    import { articleListRender, localSearch } from '$state/state';
    import { filterArticles } from '$lib/common/filter';
    import type { ArticleBase } from '$shared/types/api';
    import List from './main.svelte';

    export let articles: ArticleBase[];
</script>

<div
    class="
	bg-surface-100

	grow

	p-6
	sm:p-12
"
>
    <List
        articles={filterArticles(articles, $localSearch)}
        layout={$articleListRender}
    />
</div>
