<script lang="ts">
  import Fa from "svelte-fa";
  import { faObjectGroup } from "@fortawesome/free-regular-svg-icons";
  import { faUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";

  import { controlParams, resetState } from "../../state";

  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
  import type { PointerModes } from "../../state";

  const { pointerMode } = controlParams;

  const pointerModes: Array<{
    icon: IconDefinition;
    name: PointerModes;
    description: string;
  }> = [
    {
      icon: faUpDownLeftRight,
      name: "pan",
      description: "Pan and zoom across the map (ctrl + alt + a)",
    },
    {
      icon: faObjectGroup,
      name: "select",
      description: "Select objects from the map (ctrl + alt + s)",
    },
  ];
</script>

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
        ? 'bg-primary-500/60 dark:bg-primary-600/60 hover:bg-primary-500/60'
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
