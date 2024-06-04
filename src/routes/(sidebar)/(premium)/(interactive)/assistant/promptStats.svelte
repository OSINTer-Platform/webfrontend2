<script lang="ts">
  import type { ArticleBase, ArticleSearchQuery } from "$shared/types/api";

  import Searchbar from "./searchbar.svelte";
  import ArticleList from "./articleList.svelte";
  import Loader from "$com/loader.svelte";
  import Fa from "svelte-fa";

  import { faPlus } from "@fortawesome/free-solid-svg-icons";
  import { queryArticles } from "$lib/common/queryArticles";

  export let previousSearch: string;
  export let newSearch: string = "";
  export let articles: ArticleBase[];

  let extraArticles: Promise<null | ArticleBase[]> = new Promise((resolve) =>
    resolve(null)
  );

  async function queryExtraArticles() {
    const q: ArticleSearchQuery = {
      limit: 20,
      sort_order: "desc",
      semantic_search: previousSearch,
    };

    return await queryArticles(q).then(({ documents }) => documents);
  }
</script>

<section
  class="
  @5xl/full:h-full
  w-full max-w-prose mx-auto
  flex flex-col
"
>
  <Searchbar
    bind:value={newSearch}
    on:submit
    manualActive={true}
    placeholder={"Ask a new question"}
  />

  <hr class="border-surface-400/25 border my-12" />

  <h2
    class="
    flex justify-between mb-8
    font-bold text-3xl
  "
  >
    Articles used for answers: <span class="font-light text-2xl"
      >{articles.length}</span
    >
  </h2>

  <ArticleList {articles} />

  <hr class="border-surface-400/25 border my-12" />

  {#await extraArticles}
    <Loader text="Loading extra articles" />
  {:then extraArticlesContent}
    {#if !extraArticlesContent}
      <button
        on:click={() => (extraArticles = queryExtraArticles())}
        title="Load more articles"
        class="
          btn m-auto
          aspect-square w-40
          border border-primary-500

          !text-primary-500 text-3xl

      "><Fa icon={faPlus} /></button
      >
    {:else}
      <h2
        class="
          flex justify-between mb-8
          font-bold text-3xl
        "
      >
        Similar articles: <span class="font-light text-2xl"
          >{extraArticlesContent.length}</span
        >
      </h2>
      <ArticleList articles={extraArticlesContent} class="overflow-y-auto" />
    {/if}
  {/await}
</section>
