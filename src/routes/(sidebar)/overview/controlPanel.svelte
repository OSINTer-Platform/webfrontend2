<script lang="ts">
  import Search from "$com/utils/search.svelte";
  import Switch from "$com/utils/switch.svelte";
  import { controlParams } from "./state";

  const { dotSize, toolTipSize, deepSearch, search, enableSearch } =
    controlParams;
</script>

<aside
  class="
    absolute z-20
    flex flex-col
    w-80 top-10 left-10 p-4
    border-surface-400 border
    bg-surface-500/30
  "
>
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
      on:change={() => ($search = "")}
    />
  </div>

  {#if $enableSearch}
    <Search
      placeholder={"Search in articles"}
      bind:value={$search}
      containerClass={"mt-4 mb-2"}
    />

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
      <Switch
        bind:checked={$deepSearch}
        name="Enable Deep Search"
        size={"xs"}
      />
    </div>
  {/if}
</aside>
