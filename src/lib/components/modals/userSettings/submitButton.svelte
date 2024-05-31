<script lang="ts">
  import {
    faCheck,
    faPaperPlane,
    faSpinner,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let state: null | Promise<string>;
  export let disabled: boolean;
  export let submitString: string;
  export let disabledString: string;
  export let extraBtnClass: string = "";

  $: btnClass = `inline-flex items-center justify-center h-12 rounded-sm transition-all duration-300 disabled:cursor-not-allowed ${extraBtnClass}`;
</script>

{#if state}
  {#await state}
    <div
      title="Submitting..."
      class="
        {btnClass} border border-surface-400/50"
    >
      <Fa icon={faSpinner} class="animate-spin" />
    </div>
  {:then state}
    <button
      title={disabled ? `${state}\n${disabledString}` : state}
      class="
        {btnClass}
        bg-success-500/40 hover:bg-success-500/50
        transition-all duration-300 active:scale-95
      "
      {disabled}
    >
      <Fa icon={faCheck} />
    </button>
  {:catch e}
    <button
      title={disabled ? `${e} - ${disabledString}` : e}
      class="
        {btnClass}
        bg-error-500/40 hover:bg-error-500/50
        transition-all duration-300 active:scale-95
      "
      {disabled}
    >
      <Fa icon={faXmark} />
    </button>
  {/await}
{:else}
  <button
    title={disabled ? disabledString : submitString}
    class="
      btn {btnClass}
      bg-primary-400/10 disabled:bg-surface-400/20
    "
    {disabled}
  >
    <Fa
      icon={faPaperPlane}
      class="transition-colors {disabled ? 'opacity-50' : 'text-primary-500'}"
    />
  </button>
{/if}
