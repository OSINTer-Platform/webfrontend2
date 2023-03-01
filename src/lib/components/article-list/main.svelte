<script lang="ts">
    import type { ArticleBase } from '$shared/types/api';
    import type { ArticleRender } from '$shared/types/internal';

    import Large from './component/large.svelte';
    import Title from './component/title.svelte';

    export let articles: ArticleBase[] = [];
    export let layout: ArticleRender = 'large';

    const layouts: { [articleRender in ArticleRender]: any } = {
        large: Large,
        title: Title,
    };
</script>

<svelte:component this={layouts[layout]} {articles} />
