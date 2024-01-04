<script lang="ts">
  import type { LayoutData } from "./$types";

  import "../app.css";

  import TopBar from "./topbar.svelte";
  import Modals from "$com/modals/all.svelte";
  import { ProgressBar } from "@prgm/sveltekit-progress-bar";

  import { modalState, darkMode } from "$state/state";
  import { init as initApm } from "@elastic/apm-rum";
  import { env } from "$env/dynamic/public";
  import { page } from "$app/stores";
  import { afterNavigate } from "$app/navigation";

  export let data: LayoutData;

  if ("PUBLIC_APM_ENV" in env && "PUBLIC_APM_URL" in env) {
    initApm({
      serviceName: "OSINTer-webfrontend",
      serverUrl: env.PUBLIC_APM_URL,
      serviceVersion: "5.0",
      environment: env.PUBLIC_APM_ENV,
    });
  }

  function handleKeypress(e: KeyboardEvent) {
    switch (e.key) {
      case "Escape":
        if (e.getModifierState("Shift") || e.getModifierState("Control"))
          modalState.set([]);
        else $modalState.pop();

        break;
    }
  }

  afterNavigate(() => {
    modalState.set([]);
  });
</script>

<svelte:window on:keydown={(e) => handleKeypress(e)} />

<ProgressBar class="text-primary-500" zIndex={100} settleTime={300} />

<div class="h-screen overflow-hidden flex flex-col" class:dark={$darkMode}>
  <Modals />
  {#if $page.data.topbar ?? true}
    <div class="z-40 relative">
      <TopBar user={data.user} />
    </div>
  {/if}
  <slot />
</div>
