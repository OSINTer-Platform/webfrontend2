<script lang="ts">
  import Fa from "svelte-fa";
  import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/index";
  import { onMount } from "svelte";

  export let value = "";
  export let placeholder = "";
  export let containerClass = "";
  export let inputClass = "";
  export let inputName = "";
  export let infoText = "";
  export let disabled = false;

  onMount(() => {
    value = "";
  });
</script>

<div
  class="
    flex items-center

    bg-surface-600/10 text-black
    rounded-sm

    border border-tertiary-600/50
    {disabled
    ? 'cursor-not-allowed'
    : 'hover:border-tertiary-600 focus:border-tertiary-600 focus-within:border-tertiary-600'}

    transition-colors duration-300

    {containerClass}
  "
>
  <label
    class="flex gap-2 text-tertiary-800 m-2 w-full {disabled
      ? 'cursor-not-allowed'
      : 'cursor-text'}"
  >
    <Fa icon={faMagnifyingGlass} />

    <input
      {disabled}
      name={inputName}
      bind:value
      {placeholder}
      class:cursor-not-allowed={disabled}
      class="
        grow h-full min-w-0 shrink-1
        bg-transparent placeholder-tertiary-800
        text-white text-xs
        border-0 focus:outline-none focus:border-0
        {inputClass}
    "
    />

    {#if infoText}
      <p class="text-xs text-black/60 dark:text-white/60 shrink-0">
        {infoText}
      </p>
    {/if}
  </label>
  <slot />
</div>
