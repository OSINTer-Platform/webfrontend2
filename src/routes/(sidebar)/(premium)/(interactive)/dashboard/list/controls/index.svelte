<script lang="ts">
  import ControlShell from "../../controls/shell.svelte";
  import SpeedSlider from "./speedSlider.svelte";

  export let startDate: Date;
  export let endDate: Date;

  export let scrollSpeed: number;
</script>

<ControlShell {startDate} {endDate} on:date>
  <SpeedSlider bind:value={scrollSpeed} />
</ControlShell>
