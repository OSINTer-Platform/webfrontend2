<script lang="ts">
  import type { ArticleCategories, ClusterBase } from "$shared/types/api";

  import PanelShell from "../panelShell.svelte";
  import Controls from "./controls.svelte";
  import Pointermodes from "./pointermodes.svelte";
  import Sources from "./sources/index.svelte";
  import Clusters from "./clusters.svelte";

  import { controlParams } from "../../state";

  const { pointerMode } = controlParams;

  export let articleCategories: ArticleCategories;
  export let clusters: ClusterBase[];
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

<PanelShell>
  <Pointermodes />
</PanelShell>

<PanelShell>
  <Controls />
</PanelShell>

<PanelShell class="h-96">
  <Sources {articleCategories} />
</PanelShell>

<PanelShell class="h-[28rem]">
  <Clusters {clusters} />
</PanelShell>
