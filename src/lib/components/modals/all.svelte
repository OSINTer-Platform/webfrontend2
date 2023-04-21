<script lang="ts">
    import { modalState } from '$state/state';
    import Article from './article.svelte';
</script>

{#if $modalState.modalType == 'article'}
    <Article
        article={$modalState.modalContent.article}
        articleCategories={$modalState.modalContent.categories}
    />
{/if}
