<script lang="ts">
  import AppSwitcher from "./components/appSwitcher.svelte";
  import SidebarShell from "./components/shell.svelte";
</script>

<SidebarShell>
  <svelte:fragment slot="nav">
    <AppSwitcher />
  </svelte:fragment>
</SidebarShell>
