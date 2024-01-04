<script lang="ts">
  import { modalState } from "$state/modals";
  import Article from "./article/index.svelte";
  import Search from "./search.svelte";
  import AddCollection from "./addCollection.svelte";
</script>

{#each $modalState as modal (modal.id)}
  {#if modal.modalType == "article"}
    <Article
      article={modal.modalContent.article}
      articleCategories={modal.modalContent.categories}
      articleList={modal.modalContent.articleList}
    />
  {:else if modal.modalType == "search"}
    <Search
      searchQuery={modal.modalContent.query}
      callback={modal.modalContent.searchAction}
      searchText={modal.modalContent.searchText}
    />
  {:else if modal.modalType == "add-collection"}
    <AddCollection article={modal.modalContent.article} />
  {/if}
{/each}
