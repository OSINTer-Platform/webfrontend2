<script lang="ts">
  import { page } from "$app/stores";
  import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

  import Switch from "$com/utils/inputs/switch.svelte";

  $: darkMode = $page.data.settings.darkMode;
</script>

<Switch
  bind:checked={$darkMode}
  size="lg"
  name="light-switch"
  title="Toggle dark/light mode"
  icons={{ off: faSun, on: faMoon }}
  iconClass="text-sm text-white dark:text-black"
  bgClass="!bg-black dark:!bg-white"
/>
