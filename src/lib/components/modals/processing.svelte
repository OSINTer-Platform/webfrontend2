<script lang="ts">
  import Modal from "./modal.svelte";
  import Loader from "$com/loader.svelte";

  import { onMount } from "svelte";
  import { modalState } from "$shared/state/modals";

  export let process: Promise<any>;
  export let modalId: string;
  export let text: string | null = null;

  onMount(async () => {
    await process;
    modalState.remove(modalId);
  });
</script>

<Modal
  class="
    p-6
    max-w-[90vw]
    flex flex-col
    overflow-hidden

    bg-surface-100 dark:bg-surface-800
  "
  style="max-height: min(90vh, 40rem)"
>
  <Loader {text} />
</Modal>
