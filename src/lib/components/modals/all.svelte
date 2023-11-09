<script lang="ts">
  import { modalState } from "$state/state";
  import Article from "./article/index.svelte";
  import Search from "./search.svelte";
  import AddCollection from "./addCollection.svelte";
</script>

{#if $modalState.modalType == "article"}
  <Article
    article={$modalState.modalContent.article}
    articleCategories={$modalState.modalContent.categories}
    articleList={$modalState.modalContent.articleList}
  />
{:else if $modalState.modalType == "search"}
  <Search
    searchQuery={$modalState.modalContent.query}
    callback={$modalState.modalContent.searchAction}
    searchText={$modalState.modalContent.searchText}
  />
{:else if $modalState.modalType == "add-collection"}
  <AddCollection article={$modalState.modalContent.article} />
{/if}
