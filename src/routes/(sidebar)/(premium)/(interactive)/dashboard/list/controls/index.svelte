<script lang="ts">
  import ControlShell from "../../controls/shell.svelte";
  import Options from "./options.svelte";
  import SpeedSlider from "./speedSlider.svelte";

  export let startDate: Date;
  export let endDate: Date;

  export let scrollSpeed: number;
  export let showQr: boolean;
</script>

<ControlShell {startDate} {endDate} on:date extraElCount={2}>
  <SpeedSlider bind:value={scrollSpeed} />
  <Options bind:showQr />
</ControlShell>
