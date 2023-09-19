<script lang="ts">
  import { controlParams } from "../../state";
  import PanelShell from "../panelShell.svelte";
  import Controls from "./controls.svelte";
  import Pointermodes from "./pointermodes.svelte";

  const { pointerMode } = controlParams;
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
