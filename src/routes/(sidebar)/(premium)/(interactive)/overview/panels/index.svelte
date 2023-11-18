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
  top-5 left-5 bottom-5
  flex flex-col gap-4
  w-80 p-4
  overflow-y-auto
"
>
  <ControlPanel {articleCategories} />
</aside>

{#if $selectedArticles.length > 0}
  <aside
    class="
    absolute z-20
    top-10 right-10 bottom-10

    flex flex-col gap-4
    w-96
  "
  >
    <SelectionPanel />
  </aside>
{/if}
