<script lang="ts">
  type Value = $$Generic<string>;

  export let options: { text: string; value: Value }[];
  export let selected: Value;

  export let selectedClass: string = "text-primary-500";
  export let unselectedClass: string = "opacity-25";
</script>

{#each options as { text, value }, i}
  {#if i > 0}
    <slot name="seperator">
      <span class="opacity-25">/</span>
    </slot>
  {/if}
  <label
    class="
    underline mr-1 cursor-pointer
    {selected === value ? selectedClass : unselectedClass}
  "
    ><input
      class="hidden"
      type="radio"
      {value}
      bind:group={selected}
    />{text}</label
  >
{/each}
