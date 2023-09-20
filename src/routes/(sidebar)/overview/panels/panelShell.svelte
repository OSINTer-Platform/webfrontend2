<script lang="ts">
  let classes: string = "";
  export { classes as class };
</script>

<div
  class="
    flex flex-col p-4

    border-surface-400 border
    bg-surface-100/90 dark:bg-surface-800/90
    backdrop-blur
    {classes}
  "
>
  <slot />
</div>
