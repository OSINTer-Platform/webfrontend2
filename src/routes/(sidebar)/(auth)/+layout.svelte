<script lang="ts">
</script>

<div
  class="
    bg-surface-100
    dark:bg-surface-800

    w-full

    flex
    flex-row

    overflow-x-auto
"
>
  <main
    class="
      flex flex-col gap-8
      items-center
      p-8 sm:py-16 m-auto

      max-w-md lg:max-w-lg grow
      h-fit
  "
  >
    <slot />
  </main>
</div>
