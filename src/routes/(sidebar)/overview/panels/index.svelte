<script lang="ts">
  import { selectedArticles } from "../state";
  import ControlPanel from "./controlpanel/index.svelte";
  import SelectionPanel from "./selectionPanel/index.svelte";
</script>

<aside
  class="
  absolute z-20
  flex flex-col
  w-80 top-10 left-10
"
>
  <ControlPanel />
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
