<script lang="ts">
  export let style = "";
  let classes = "grid";

  export { classes as class };
</script>

<div
  class="
  {classes}
  w-full h-full
  row-start-1 col-start-1
  grid-rows-6

  2xl:grid-cols-[repeat(16,_minmax(0,_1fr))]
  xl:grid-cols-12 lg:grid-cols-10 md:grid-cols-7 grid-cols-4
"
  {style}
>
  {#each Array(100) as _}
    <div class="outline-1 outline outline-primary-500" />
  {/each}
</div>
