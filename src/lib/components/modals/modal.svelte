<script lang="ts">
  import { modalState } from "$state/modals";
  import { fly, fade } from "svelte/transition";

  let classes: string = "";
  export { classes as class };
  export let style = "";
  export let border = true;

  const resetModal = (
    e:
      | MouseEvent
      | (KeyboardEvent & {
          currentTarget: EventTarget & HTMLDivElement;
        })
  ) => {
    if (e.target === e.currentTarget) modalState.remove();
  };
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
    in:fly|global={{ y: 50 }}
    out:fly|global={{ y: 50 }}
    class="
      overflow-auto
      cursor-auto
      {classes}

      {border ? 'border border-tertiary-500' : ''}
    "
    {style}
  >
    <slot />
  </div>
</div>
