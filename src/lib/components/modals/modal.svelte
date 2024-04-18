<script lang="ts">
  import { modalState } from "$state/modals";
  import { fly, fade } from "svelte/transition";

  let classes: string = "";
  export { classes as class };
  export let style = "";
  export let border = true;

  const resetModal = () => modalState.remove();
</script>

<div
  role="presentation"
  on:click={resetModal}
  on:keydown={resetModal}
  transition:fade|global={{ duration: 200 }}
  class="
    z-40 absolute
    h-screen w-screen
    flex flex-col items-center justify-center
    bg-black/60
  "
>
  <div
    role="presentation"
    on:click|stopPropagation
    on:keydown|stopPropagation
    in:fly|global={{ y: 50 }}
    out:fly|global={{ y: 50 }}
    class="
      overflow-auto
      cursor-auto
      {classes}

      {border ? 'rounded-xl border border-tertiary-500' : ''}
    "
    {style}
  >
    <slot />
  </div>
</div>
