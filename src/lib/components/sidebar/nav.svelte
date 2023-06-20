<script lang="ts">
  import AppSwitcher from "./compontents/appSwitcher.svelte";
  import SidebarShell from "./compontents//shell.svelte";
</script>

<SidebarShell>
  <svelte:fragment slot="nav">
    <AppSwitcher />
  </svelte:fragment>
</SidebarShell>
