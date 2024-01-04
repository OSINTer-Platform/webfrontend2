<script lang="ts">
  import { modalState } from "$state/state";
  import { fly, fade } from "svelte/transition";

  let classes: string = "";
  export { classes as class };
  export let style = "";

  const resetModal = () => modalState.remove();
</script>

<div
  on:click={resetModal}
  on:keydown={resetModal}
  transition:fade={{ duration: 200 }}
  class="
    z-50

    absolute

    h-screen
    w-screen

    flex
    flex-col
    items-center
    justify-center

    bg-black/60
  "
>
  <div
    on:click|stopPropagation
    on:keydown|stopPropagation
    in:fly={{ y: 50 }}
    out:fly={{ y: 50 }}
    class="
      overflow-auto
      cursor-auto
      {classes}
    "
    {style}
  >
    <slot />
  </div>
</div>
