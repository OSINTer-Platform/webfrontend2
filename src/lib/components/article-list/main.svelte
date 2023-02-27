<script lang="ts">
    import type { ArticleBase } from '$shared/types';

    import Large from './component/large.svelte';
    import Title from './component/title.svelte';

    export let articles: ArticleBase[] = [];
    export let layout: string = 'large';

    const layouts: { [key: string]: any } = {
        large: Large,
        title: Title,
    };
</script>

<svelte:component this={layouts[layout]} {articles} />
