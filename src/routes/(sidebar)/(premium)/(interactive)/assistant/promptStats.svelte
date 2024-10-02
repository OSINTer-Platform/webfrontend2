<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";

  import Searchbar from "./searchbar.svelte";
  import ArticleList from "./articleList.svelte";

  export let newSearch: string = "";
  export let articles: ArticleBase[];
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
</section>
