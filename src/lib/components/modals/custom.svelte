<script lang="ts">
  import type { ComponentType, SvelteComponent } from "svelte";

  import Modal from "./modal.svelte";

  export let component: ComponentType<
    SvelteComponent<{ modalId: string; data: any }>
  >;
  export let modalId: string;
  export let data: any;
  let classes: string = "";

  export { classes as class };
</script>

<Modal class={classes}>
  <svelte:component this={component} {modalId} {data} />
</Modal>
