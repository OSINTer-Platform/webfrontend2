<script lang="ts">
  import type { ArticleCategories } from "$shared/types/api";

  import PanelShell from "../panelShell.svelte";
  import Controls from "./controls.svelte";
  import Pointermodes from "./pointermodes.svelte";

  import { controlParams } from "../../state";
  import Sources from "./sources/index.svelte";

  const { pointerMode } = controlParams;

  export let articleCategories: ArticleCategories;
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.ctrlKey && e.altKey) {
      switch (e.key) {
        case "a":
          pointerMode.set("pan");
          break;
        case "s":
          pointerMode.set("select");
          break;
      }
    }
  }}
/>

<PanelShell class="mb-8">
  <Pointermodes />
</PanelShell>

<PanelShell class="mb-8">
  <Controls />
</PanelShell>

<PanelShell class="h-96">
  <Sources {articleCategories} />
</PanelShell>
