<script lang="ts">
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  type ButtonType = "primary" | "secondary" | "yes" | "no" | "cancel";

  export let type: ButtonType;
  export let action: () => void | boolean | Promise<void> | Promise<boolean>;
  export let close: () => void;

  let loading = false;

  async function runAndClose() {
    if (loading) return;
    loading = true;

    const r = await action();
    if (r != false) close();

    loading = false;
  }
</script>

<button
  on:click={runAndClose}
  class="
    first:rounded-l-md last:rounded-r-md
    text-sm sm:text-base
    p-2 w-28 sm:p-2 sm:w-40
    active:scale-95
    transition-all

    {type === 'yes' ? 'bg-success-700/50 hover:bg-success-500/60' : ''}
    {type === 'no' ? 'bg-error-700/50 hover:bg-error-500/60' : ''}
    {type === 'cancel' ? 'bg-gray-500/50 hover:bg-gray-500/60' : ''}
    {type === 'primary' ? 'bg-primary-600/50 hover:bg-primary-600/75' : ''}
    {type === 'secondary'
    ? 'border border-primary-500/50 hover:bg-primary-600/20'
    : ''}
  "
>
  {#if loading}
    <Fa icon={faSpinner} class="animate-spin mx-auto" />
  {:else}
    <slot />
  {/if}
</button>
