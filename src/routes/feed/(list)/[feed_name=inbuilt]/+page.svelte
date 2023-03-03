<script lang="ts">
    import type { PageData } from './$types';
    import List from '$com/article-list/main.svelte';

    import { articleListRender, localSearch } from '$shared/state';
    import { filterArticles } from '$lib/common';

    export let data: PageData;
</script>

<div
    class="
	bg-surface-100

	p-6
	sm:p-12
"
>
    <List
        articles={filterArticles(data.articles, $localSearch)}
        layout={$articleListRender}
    />
</div>
