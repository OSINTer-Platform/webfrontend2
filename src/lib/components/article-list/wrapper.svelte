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

	p-4
	sm:p-12
"
>
    {#if articles.length > 0}
        <List {articles} layout={$articleListRender} />
    {:else}
        <div
            class="h-full mx-auto px-8 max-w-2xl flex flex-col justify-center text-center dark:text-white"
        >
            <h2 class="md:text-4xl sm:text-3xl text-2xl font-bold md:mb-2">
                Well, it looks rather empty here...
            </h2>
            <p class="md:text-xl sm:text-lg font-light md:tracking-tighter">
                Try using another feed or collection, or contact your system
                administrator if you believe this is an error.
            </p>
        </div>
    {/if}
</div>
