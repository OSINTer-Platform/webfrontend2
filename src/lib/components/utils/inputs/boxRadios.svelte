<script lang="ts">
  type Value = $$Generic<string>;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{
    change: { selected: Value };
  }>();

  export let options: { text: string; value: Value }[];
  export let selected: Value;
  export let name: string;

  export let selectedClass: string =
    "bg-primary-500/50 hover:bg-primary-500/40 dark:bg-primary-800 dark:hover:bg-primary-800/75";
  export let unselectedClass: string = "bg-primary-500/10";

  function change(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    if (e.currentTarget.checked)
      dispatch("change", { selected: e.currentTarget.value as Value });
  }
</script>

{#each options as { text, value }}
  <label
    class="
    py-2 px-3 sm:py-2 sm:px-5 md:py-3 md:px-6
    min-w-max
    font-sm sm:font-base md:font-lg
    border border-primary-500 btn
    {value === selected ? selectedClass : unselectedClass}
  "
  >
    <input
      type="radio"
      {name}
      {value}
      bind:group={selected}
      class="hidden"
      on:change={change}
    />
    {text}
  </label>
{/each}
