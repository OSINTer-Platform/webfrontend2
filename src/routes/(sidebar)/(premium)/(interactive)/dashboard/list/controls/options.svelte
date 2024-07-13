<script lang="ts">
  import { faQrcode } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";

  export let showQr: boolean;
</script>

<div
  class="
  flex rounded-full px-4
  bg-black max-w-max
"
>
  <button
    on:click={() => (showQr = !showQr)}
    class="
      btn text-white
      my-auto w-10 aspect-square
    "
  >
    <Fa icon={faQrcode} class={showQr ? "text-primary-500" : ""} />
  </button>
</div>
