<script lang="ts">
  import Fa from "svelte-fa/src/fa.svelte";
  import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/index";
  import { page } from "$app/stores";

  export let value: string = "";
  export let placeholder: string = "";
  export let containerClass: string = "";
  export let inputClass: string = "";
</script>

<form
  class="
    flex items-center

    border border-tertiary-600
    bg-surface-600/10 text-black
    rounded-md

    {containerClass}
  "
  action="/feed/search"
  method="get"
>
  <label class="flex gap-2 text-tertiary-800 m-2 w-full">
    <Fa icon={faMagnifyingGlass} />

    <input
      name={$page.data.mlAvailability?.elser
        ? "semantic_search"
        : "search_term"}
      bind:value
      {placeholder}
      class="
      grow h-full
      bg-transparent placeholder-tertiary-800 text-xs dark:text-white
      border-0 focus:outline-none focus:border-0
      {inputClass}
    "
    />
  </label>
  <slot />
</form>
