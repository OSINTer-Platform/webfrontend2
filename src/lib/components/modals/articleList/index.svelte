<script lang="ts">
  import type { ArticleBase } from "$shared/types/api";

  import Modal from "../modal.svelte";
  import Loader from "$com/loader.svelte";
  import Main from "./main.svelte";

  export let articles: ArticleBase[] | Promise<ArticleBase[]>;
</script>

<Modal
  class="
    w-[90vw] h-[95vh]
    flex flex-col

    border border-tertiary-500/75
    bg-surface-100 dark:bg-surface-900
  "
>
  {#await articles}
    <Loader text="Loading list articles" />
  {:then articles}
    <Main {articles} />
  {/await}
</Modal>
