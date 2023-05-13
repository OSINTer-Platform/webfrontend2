<script lang="ts">
    import { articleListRender } from '$state/state';
    import type { ArticleBase } from '$shared/types/api';
    import List from './main.svelte';

    export let articles: ArticleBase[];
</script>

<div
    class="
	bg-surface-100
	dark:bg-surface-900

	grow

	p-6
	sm:p-12
"
>
    <List {articles} layout={$articleListRender} />
</div>
