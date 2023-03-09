<script lang="ts">
    import AppSwitcher from '$com/sidebar/appSwitcher.svelte';
    import SidebarShell from '$com/sidebar/shell.svelte';
</script>

<SidebarShell>
    <AppSwitcher />
</SidebarShell>

<main
    class="
	w-full
	h-full

	bg-surface-100

	@container/full
"
>
    <slot />
</main>
