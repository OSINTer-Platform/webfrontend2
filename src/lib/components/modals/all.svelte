<script lang="ts">
  import { modalState } from "$state/modals";
  import Article from "./article/index.svelte";
  import Search from "./search.svelte";
  import AddCollection from "./addCollection.svelte";
  import ArticleList from "./articleList/index.svelte";
  import UserSettings from "./userSettings/index.svelte";
  import Info from "./info.svelte";
  import Options from "./options/index.svelte";
</script>

{#each $modalState as modal, i (modal.id)}
  {@const topModal = i + 1 == $modalState.length}
  {#if modal.modalType == "article"}
    <Article
      article={modal.modalContent.article}
      articleCategories={modal.modalContent.categories}
      articleList={modal.modalContent.articleList}
      {topModal}
    />
  {:else if modal.modalType == "search"}
    <Search
      searchQuery={modal.modalContent.query}
      callback={modal.modalContent.searchAction}
      searchText={modal.modalContent.searchText}
    />
  {:else if modal.modalType == "add-collection"}
    <AddCollection article={modal.modalContent.article} />
  {:else if modal.modalType == "article-list"}
    <ArticleList articles={modal.modalContent.articles} />
  {:else if modal.modalType == "user-settings"}
    <UserSettings {topModal} />
  {:else if modal.modalType == "info"}
    <Info
      title={modal.modalContent.title}
      description={modal.modalContent.description}
    />
  {:else if modal.modalType == "options"}
    <Options
      title={modal.modalContent.title}
      description={modal.modalContent.description}
      options={modal.modalContent.options}
      type={modal.modalContent.type}
      modalId={modal.id}
    />
  {/if}
{/each}
