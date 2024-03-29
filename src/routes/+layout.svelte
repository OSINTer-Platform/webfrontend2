<script lang="ts">
  import type { LayoutData } from "./$types";

  import "../app.css";

  import TopBar from "./topbar.svelte";
  import Modals from "$com/modals/all.svelte";
  import { ProgressBar } from "@prgm/sveltekit-progress-bar";

  import { modalState } from "$state/modals";

  import { init as initApm } from "@elastic/apm-rum";
  import { env } from "$env/dynamic/public";
  import { page } from "$app/stores";
  import { afterNavigate } from "$app/navigation";
  import { onMount } from "svelte";

  export let data: LayoutData;

  $: darkMode = $page.data.settings.darkMode;
  $: user = data.user;

  function handleKeypress(e: KeyboardEvent) {
    switch (e.key) {
      case "Escape":
        if (e.getModifierState("Shift") || e.getModifierState("Control"))
          modalState.set([]);
        else modalState.remove();

        break;
    }
  }

  afterNavigate(() => {
    modalState.set([]);
  });

  onMount(() => {
    if (
      "PUBLIC_APM_ENV" in env &&
      "PUBLIC_APM_URL" in env &&
      env.PUBLIC_APM_ENV.length > 0 &&
      env.PUBLIC_APM_URL.length > 0
    ) {
      initApm({
        serviceName: "OSINTer-webfrontend",
        serverUrl: env.PUBLIC_APM_URL,
        serviceVersion: "5.0",
        environment: env.PUBLIC_APM_ENV,
      });
    }
  });
</script>

<svelte:head>
  {#if typeof $page.data.meta.title === "string"}
    <title>{$page.data.meta.title}</title>
    <meta property="og:title" content={$page.data.meta.title} />
  {:else if $page.data.meta.title !== undefined}
    <title>{$page.data.meta.title.visual}</title>
    <meta property="og:title" content={$page.data.meta.title.meta} />
  {/if}
  <meta property="og:description" content={$page.data.meta.description} />
  <meta property="og:image" content={$page.data.meta.image} />
  <meta property="og:type" content={$page.data.meta.type} />
</svelte:head>

<svelte:window on:keydown|capture={(e) => handleKeypress(e)} />

<ProgressBar class="text-primary-500" zIndex={100} settleTime={300} />

<div class="h-screen" class:dark={$darkMode}>
  <div class="w-full h-full overflow-hidden flex flex-col dark:text-white">
    <Modals />
    {#if $page.data.topbar ?? true}
      <div class="z-40 relative">
        <TopBar user={$user} />
      </div>
    {/if}
    <slot />
  </div>
</div>
