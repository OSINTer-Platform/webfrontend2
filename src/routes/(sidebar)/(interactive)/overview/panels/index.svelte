<script lang="ts">
  import type { ArticleCategories } from "$shared/types/api";

  import { selectedArticles } from "../state";
  import ControlPanel from "./controlpanel/index.svelte";
  import SelectionPanel from "./selectionPanel/index.svelte";

  export let articleCategories: ArticleCategories;
</script>

<aside
  class="
  absolute z-20
  flex flex-col
  w-80 top-10 left-10 bottom-10
"
>
  <ControlPanel {articleCategories} />
</aside>

{#if $selectedArticles.length > 0}
  <aside
    class="
    absolute z-20
    top-10 right-10 bottom-10

    flex flex-col
    w-96
  "
  >
    <SelectionPanel />
  </aside>
{/if}
