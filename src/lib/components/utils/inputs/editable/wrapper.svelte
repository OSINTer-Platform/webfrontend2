<script lang="ts">
  import Fa from "svelte-fa";
  import { faPencil } from "@fortawesome/free-solid-svg-icons/index";

  const focusEditable = (e: any) => e.currentTarget.children[0].focus();
  let classes: string = "";

  export { classes as class };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  tabindex="0"
  role="textbox"
  on:click={focusEditable}
  class="link-underline cursor-text {classes}"
>
  <slot />

  <Fa icon={faPencil} />
</div>
