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

  onMount(() => {
    value = "";
  });
</script>

<div
  class="
    flex items-center

    border border-tertiary-600
    bg-surface-600/10 text-black
    rounded-md

    {containerClass}
  "
>
  <label class="flex gap-2 text-tertiary-800 m-2 w-full cursor-text">
    <Fa icon={faMagnifyingGlass} />

    <input
      name={inputName}
      bind:value
      {placeholder}
      class="
        grow h-full min-w-0 shrink-1
        bg-transparent placeholder-tertiary-800 text-xs
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
