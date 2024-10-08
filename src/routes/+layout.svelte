<script lang="ts">
  import "../app.css";

  import TopBar from "./topbar.svelte";
  import Modals from "$com/modals/all.svelte";
  import Tooltip from "$com/tooltip.svelte";
  import { ProgressBar } from "@prgm/sveltekit-progress-bar";

  import { modalState } from "$state/modals";

  import { init as initApm } from "@elastic/apm-rum";
  import { env } from "$env/dynamic/public";
  import { page } from "$app/stores";
  import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { spawnPaymentModal } from "$lib/common/modals";
  import { config } from "$shared/config";
  import { sideOpen, tooltip } from "$shared/state/state";

  import type { PageData } from "./$types";

  export let data: PageData;

  $: darkMode = $page.data.settings.darkMode;
  $: user = data.user;
  $: remindMePaymentUpdate = data.remindMe.paymentUpdate;

  let showProgressBar = true;

  function handleKeypress(e: KeyboardEvent) {
    switch (e.key) {
      case "Escape":
        if (e.getModifierState("Shift") || e.getModifierState("Control"))
          modalState.set([]);
        else modalState.remove();

        break;
    }
  }

  beforeNavigate(({ type, delta, cancel }) => {
    if (type === "popstate" && delta && delta < 0 && $modalState.length > 0) {
      // See https://github.com/prgm-dev/sveltekit-progress-bar/issues/5
      showProgressBar = false;

      cancel();

      let deltaLeft = 0;
      for (let i = 0; i > delta; i--) {
        if ($modalState.length > 0) modalState.remove();
        else deltaLeft--;
      }

      if (deltaLeft < 0) history.go(deltaLeft);

      // See https://github.com/prgm-dev/sveltekit-progress-bar/issues/5
      setTimeout(() => (showProgressBar = true), 200);
    }
  });

  afterNavigate(({ type }) => {
    if (type !== "enter") modalState.set([]);
    tooltip.set(null);
    sideOpen.set(false);
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

    if (!$page.url.pathname.startsWith("/purchase"))
      spawnPaymentModal(
        $user,
        remindMePaymentUpdate,
        data.stripe.paymentIntentClientSecret
      );
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
  <meta
    property="og:image"
    content={$page.data.meta.image ?? config.images.fullLogo}
  />
  <meta property="og:type" content={$page.data.meta.type ?? "website"} />
</svelte:head>

<svelte:window on:keydown|capture={(e) => handleKeypress(e)} />

<ProgressBar
  class="text-primary-500"
  zIndex={100}
  settleTime={300}
  noNavigationProgress={!showProgressBar}
/>

<div class="h-screen" class:dark={$darkMode}>
  <div class="w-full h-full overflow-hidden flex flex-col dark:text-white">
    <Tooltip />
    <Modals />
    {#if $page.data.topbar ?? true}
      <div
        class="
        z-30 relative
        bg-surface-100 dark:bg-surface-800
        dark:border-b dark:border-surface-300
        shadow-lg
      "
      >
        <TopBar />
      </div>
    {/if}
    <slot />
  </div>
</div>
