<script lang="ts">
  import { controlParams, resetState } from "./state";
  import type { PointerModes } from "./state";

  import Fa from "svelte-fa/src/fa.svelte";
  import { faObjectGroup } from "@fortawesome/free-regular-svg-icons";
  import {
    faUpDownLeftRight,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons";

  const { pointerMode } = controlParams;

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
  w-80 top-10 right-10 p-4
  border-surface-400 border
  bg-surface-500/30
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
</aside>
