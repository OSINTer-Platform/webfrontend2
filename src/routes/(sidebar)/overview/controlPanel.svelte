<script lang="ts">
  import Search from "$com/utils/search.svelte";
  import Switch from "$com/utils/switch.svelte";
  import Fa from "svelte-fa/src/fa.svelte";

  import { controlParams, resetState } from "./state";
  import { faObjectGroup } from "@fortawesome/free-regular-svg-icons";

  import {
    faUpDownLeftRight,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons";

  import type { PointerModes } from "./state";

  const {
    dotSize,
    toolTipSize,
    deepSearch,
    articleSearch,
    enableSearch,
    pointerMode,
  } = controlParams;

  const pointerModes: Array<{
    icon: IconDefinition;
    name: PointerModes;
    description: string;
  }> = [
    {
      icon: faUpDownLeftRight,
      name: "pan",
      description: "Pan and zoom across the map",
    },
    {
      icon: faObjectGroup,
      name: "select",
      description: "Select objects from the map",
    },
  ];
</script>

<aside
  class="
  absolute z-20
  flex flex-col
  w-80 top-10 left-10
"
>
  <div
    class="
    flex flex-col p-4 mb-8

    border-surface-400 border
    bg-surface-800/90
    backdrop-blur

  "
  >
    <button
      on:click={resetState}
      class="
    btn mb-4 h-14
    font-bold text-xl
    border-surface-400 border
    dark:bg-surface-600/80
  ">Reset</button
    >

    <div
      class="
    flex h-14
    border-surface-400 border
    dark:bg-surface-600/80
    "
    >
      {#each pointerModes as { icon, name, description }}
        <label
          title={description}
          class="
        btn active:scale-100
        grow
        text-xl

        {$pointerMode === name
            ? 'bg-primary-600/60 hover:bg-primary-500/60'
            : ''}
      "
        >
          <input
            type="radio"
            bind:group={$pointerMode}
            name="pointer-mode-selection"
            value={name}
            class="hidden"
          />
          <Fa {icon} />
        </label>
      {/each}
    </div>
  </div>

  <div
    class="
    flex flex-col p-4 mb-8

    border-surface-400 border
    bg-surface-800/90
    backdrop-blur

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
        on:change={() => ($articleSearch = "")}
      />
    </div>

    {#if $enableSearch}
      <Search
        placeholder={"Search in articles"}
        bind:value={$articleSearch}
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
  </div>
</aside>
