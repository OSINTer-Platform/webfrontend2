<script lang="ts">
  import AppSwitcher from "$com/sidebar/nav.svelte";
  import { page } from "$app/stores";
</script>

<div class="flex flex-row flex-grow items-stretch min-h-0 relative">
  {#if !$page.data.customSidebar}
    <AppSwitcher />
  {/if}
  <slot />
</div>
