<script lang="ts">
  import { page } from "$app/stores";
  import Search from "$inputs/search.svelte";
  import Switch from "$inputs/switch.svelte";

  import { controlParams } from "../../state";
  const { dotSize, articleSearch, enableSearch } = controlParams;

  $: listCount = $page.data.listElementCount;
  $: searchInfo = listCount ? `${$listCount} articles` : "";
</script>

<div class="flex justify-between mb-4">
  <h3
    class="
        block
        text-xl font-bold
        dark:text-white
      "
  >
    Size of dots:
  </h3>
  <p
    class="
        block
        text-lg font-light italic
        dark:text-white
      "
  >
    {$dotSize.toFixed(1)} px
  </p>
</div>

<input
  type="range"
  bind:value={$dotSize}
  min="0.5"
  max="10"
  step="0.5"
  class="

      cursor-pointer
      appearance-none
      h-2 mb-8
      rounded-full
      bg-primary-500/25
      accent-primary-800
    "
/>

<!--
<div class="flex justify-between mb-4">
  <h3
    class="
        block
        text-xl font-bold
        dark:text-white
      "
  >
    Size of tooltips:
  </h3>
  <p
    class="
        block
        text-lg font-light italic
        dark:text-white
      "
  >
    {$toolTipSize.toFixed(1)} px
  </p>
</div>

<input
  type="range"
  bind:value={$toolTipSize}
  min="10"
  max="20"
  step="0.5"
  class="

      cursor-pointer
      appearance-none
      h-2 mb-12
      rounded-full
      bg-primary-500/25
      accent-primary-800
    "
/>
-->

<div class="flex justify-between">
  <label
    for="Enable Search"
    class="
        block
        text-xl font-bold
        dark:text-white
        cursor-pointer
      "
  >
    Enable Search:
  </label>
  <Switch
    bind:checked={$enableSearch}
    name="Enable Search"
    on:change={() => ($articleSearch = "")}
  />
</div>

{#if $enableSearch}
  <Search
    placeholder={"Search in articles"}
    bind:value={$articleSearch}
    containerClass={"mt-4 mb-2"}
    infoText={searchInfo}
  />

  <!--
  Disabled, due to the backend being unable to query the large amounts of data needed for deep search
  Gunicorn worker dies due to being out of memory
  <div class="flex justify-between">
    <label
      for="Enable Deep Search"
      class="
        block
        text-xs font-light italic
        dark:text-white
        cursor-pointer
      "
    >
      Enable deep search (slow):
    </label>
      <Switch bind:checked={$deepSearch} name="Enable Deep Search" size={"xs"} />
  </div>
  -->
{/if}
