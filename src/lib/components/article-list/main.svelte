<script lang="ts">
    import type { ArticleBase } from '$shared/types';
    import Large from './component/large.svelte';

    export let articles: ArticleBase[] = [];
</script>

{#each articles as article}
    <Large {article} />
{/each}
