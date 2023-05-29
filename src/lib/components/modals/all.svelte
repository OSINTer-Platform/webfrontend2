<script lang="ts">
    import { modalState } from '$state/state';
    import Article from './article.svelte';
    import Search from './search.svelte';
</script>

{#if $modalState.modalType == 'article'}
    <Article
        article={$modalState.modalContent.article}
        articleCategories={$modalState.modalContent.categories}
    />
{:else if $modalState.modalType == 'search'}
    <Search
        searchQuery={$modalState.modalContent.query}
        callback={$modalState.modalContent.searchAction}
        searchText={$modalState.modalContent.searchText}
    />
{/if}
