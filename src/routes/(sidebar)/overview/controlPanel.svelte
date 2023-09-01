<script lang="ts">
  export let size: number;
</script>

<aside
  class="
    absolute
    flex flex-col
    h-96 w-80 m-10 p-4
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
      {size} px
    </p>
  </div>
  <input
    type="range"
    bind:value={size}
    min="0.5"
    max="10"
    step="0.5"
    class="

      appearance-none
      h-2
      rounded-full
      bg-primary-500/25
      accent-primary-800
    "
  />
</aside>
