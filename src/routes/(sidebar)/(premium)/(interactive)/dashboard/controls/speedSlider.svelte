<script lang="ts">
  export let value: number;
</script>

<div
  class="w-1/3 md:w-1/5 flex rounded-full bg-black"
  title="Control scroll speed"
>
  <input
    on:change
    bind:value
    type="range"
    min="1"
    max="5"
    step="0.2"
    class="
      basis-0 w-4 shrink grow h-2 my-4 mx-4

      cursor-pointer
      appearance-none

      rounded-full accent-primary-500
      bg-primary-800 hover:bg-primary-600

      transition-all duration-300
      peer
    "
  />
</div>
