<script lang="ts">
  import Search from "$com/utils/search.svelte";
  import Switch from "$com/utils/switch.svelte";
  import { controlParams } from "./state";

  const { size, deepSearch, search, enableSearch } = controlParams;
</script>

<aside
  class="
    absolute
    flex flex-col
    w-80 m-10 p-4
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
      {$size} px
    </p>
  </div>

  <input
    type="range"
    bind:value={$size}
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
