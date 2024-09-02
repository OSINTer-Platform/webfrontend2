<script lang="ts" generics="Value">
  import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

  import Fa from "svelte-fa";

  import {
    faCheck,
    faUpRightAndDownLeftFromCenter,
  } from "@fortawesome/free-solid-svg-icons";
  import { createEventDispatcher } from "svelte";

  export let options: { value: Value; icon?: IconDefinition; text: string }[];
  export let placeholder: string = "Select an option";
  export let selected: Value | undefined = undefined;

  let classes = "w-full";
  export { classes as class };

  const dispatch = createEventDispatcher<{ change: Value }>();

  $: selectedOption = options.find((o) => o.value === selected);
</script>

<div class="[&:focus-within>ul]:flex relative {classes}">
  <button
    type="button"
    class="
      w-full p-2 flex items-center justify-between
      border-surface-400/50 border
    "
  >
    {#if selectedOption}
      <span class="flex items-center gap-2">
        {#if selectedOption.icon}
          <Fa fw icon={selectedOption.icon} />
        {/if}
        {selectedOption.text}
      </span>
    {:else}
      <span class="opacity-40">{placeholder}</span>
    {/if}
    <Fa class="opacity-40" icon={faUpRightAndDownLeftFromCenter} />
  </button>

  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <ul
    on:click|stopPropagation|preventDefault
    class="
      hidden flex-col gap-1
      absolute top-[110%] z-50
      bg-surface-100 dark:bg-surface-800
      border-surface-400/50 border
      p-2 w-full
      drop-shadow-md
    "
  >
    {#each options as { value, icon, text }}
      <li>
        <button
          type="button"
          on:click={(e) => {
            selected = value;
            dispatch("change", value);
            e.currentTarget.blur();
          }}
          class="
            p-2 w-full
            flex gap-4 items-center
            font-bold
            hover:bg-surface-400/20
            {selected === value ? 'bg-surface-400/20' : ''}
          "
        >
          {#if icon}
            <Fa fw {icon} />
          {/if}
          {text}

          {#if selected === value}
            <Fa icon={faCheck} class="ml-auto opacity-60" />
          {/if}
        </button>
      </li>
      <hr class="border-surface-400 last:hidden" />
    {/each}
  </ul>
</div>
