<script lang="ts">
  import ModalLink from "$com/modalLink.svelte";
  import type { ArticleBase } from "$shared/types/api";
  import Searchbar from "./searchbar.svelte";

  export let newSearch: string = "";
  export let articles: ArticleBase[];
</script>

<section class="w-full max-w-prose mx-auto">
  <Searchbar
    bind:value={newSearch}
    on:submit
    manualActive={true}
    placeholder={"Ask a new question"}
  />

  <hr class="text-surface-400/25 border @5xl:my-6 my-12" />

  <h2
    class="
    flex justify-between mb-8
    font-bold text-3xl dark:text-white
  "
  >
    Articles used for answers: <span class="font-light text-2xl"
      >{articles.length}</span
    >
  </h2>

  <ul
    class="
    flex flex-col gap-4
  "
  >
    {#each articles as { id, title, description }}
      <ModalLink articleId={id} articleList={articles} title={description}>
        <li
          class="
          w-full p-4
          border border-primary-500
          dark:text-white leading-6
          truncate

          hover:bg-primary-400/20
        "
        >
          {title}
        </li>
      </ModalLink>
    {/each}
  </ul>

  <hr class="text-surface-400/25 border @5xl:my-6 my-12" />
</section>
