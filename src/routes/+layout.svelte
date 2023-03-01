<script lang="ts">
    import '../app.css';

    import TopBar from './topbar.svelte';
</script>

<div class="z-50 relative">
    <TopBar />
</div>
<div class="flex flex-row flex-grow items-stretch min-h-0">
	<slot />
</div>
