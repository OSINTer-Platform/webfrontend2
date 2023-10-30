<script lang="ts">
  import type { LayoutData } from "./$types";

  import "../app.css";

  import TopBar from "./topbar.svelte";
  import Modals from "$com/modals/all.svelte";
  import { ProgressBar } from "@prgm/sveltekit-progress-bar";

  import { modalState, darkMode } from "$state/state";

  export let data: LayoutData;

  function handleKeypress(keyName: string) {
    switch (keyName) {
      case "Escape":
        $modalState = { modalType: null, modalContent: null };
        break;
    }
  }
</script>

<svelte:window on:keydown={(e) => handleKeypress(e.key)} />

<ProgressBar class="text-primary-500" zIndex={100} settleTime={300} />

<div class="h-screen overflow-hidden flex flex-col" class:dark={$darkMode}>
  <Modals />
  <div class="z-40 relative">
    <TopBar
      customSidebar={data.customSidebar}
      burgerMenu={data.burgerMenu}
      user={data.user}
    />
  </div>
  <slot />
</div>
