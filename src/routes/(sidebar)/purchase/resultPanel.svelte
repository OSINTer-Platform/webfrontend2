<script lang="ts">
  import Fa from "svelte-fa";

  import {
    faCheck,
    faSpinner,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";

  export let status: "success" | "error" | "processing" | boolean;
  export let msg: string | null = null;

  let normalizedStatus: "success" | "error" | "processing";
  $: normalizedStatus =
    typeof status === "string" ? status : status ? "success" : "error";
</script>

<div
  class="
    response p-14 grow
    flex flex-col
    items-center justify-center
    rounded-xl
    {normalizedStatus === 'success' ? 'bg-success-900/20' : ''}
    {normalizedStatus === 'error' ? 'bg-error-900/20' : ''}
    {normalizedStatus === 'processing' ? 'bg-white dark:bg-gray-900' : ''}
  "
>
  {#if normalizedStatus === "success"}
    <Fa icon={faCheck} class="text-success-500 text-8xl mb-4" />
  {:else if normalizedStatus === "error"}
    <Fa icon={faXmark} class="text-error-500 text-8xl mb-4" />
  {:else}
    <Fa icon={faSpinner} class="animate-spin text-8xl mb-4" />
  {/if}

  {#if msg && msg.length > 0}
    <p class="text-center font-light">{msg}</p>
  {/if}

  <p class="font-light text-center">
    <slot />
  </p>
</div>
