<script lang="ts">
    import AppSwitcher from './appSwitcher.svelte';
    import LinkNav from './linkNav.svelte';
</script>

<div
    class="
	hidden

	lg:grid
	grid-cols-[auto_1fr]

	w-96
	shrink-0

	bg-surface-50-900-token

	overflow-auto
"
>
    <AppSwitcher />
    <LinkNav />
</div>
