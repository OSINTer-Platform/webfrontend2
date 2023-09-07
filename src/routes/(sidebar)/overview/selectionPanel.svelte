<script lang="ts">
  import * as d3 from "d3";
  import {
    controlParams,
    d3Selection,
    d3Zoom,
    selectionBoundaries,
  } from "./state";
  import type { PointerModes } from "./state";

  import Fa from "svelte-fa/src/fa.svelte";
  import { faObjectGroup } from "@fortawesome/free-regular-svg-icons";
  import {
    faMagnifyingGlass,
    faUpDownLeftRight,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons";

  const {
    dotSize,
    toolTipSize,
    deepSearch,
    search,
    enableSearch,
    pointerMode,
  } = controlParams;

  function resetMap() {
    dotSize.reset(300);
    toolTipSize.reset(300);
    deepSearch.reset();
    search.reset();
    enableSearch.reset();

    selectionBoundaries.start.reset();
    selectionBoundaries.end.reset();

    if ($d3Zoom) {
      $d3Selection
        ?.transition()
        .duration(750)
        .call($d3Zoom.transform, d3.zoomIdentity);
    }
  }

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
    on:click={resetMap}
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
