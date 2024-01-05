<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";
  import Modal from "./modal.svelte";
  import List from "$com/article-list/main.svelte";

  export let articles: ArticleBase[];
</script>

<Modal
  class="
    w-[90vw] h-[95vh]
    flex flex-col

    border border-tertiary-500/75
    bg-surface-100 dark:bg-surface-900
  "
>
  <main class="m-6 sm:m-12 xl:m-16 overflow-y-auto">
    <List {articles} tintReadArticles={true} />
  </main>
</Modal>
