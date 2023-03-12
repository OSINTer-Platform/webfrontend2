<script lang="ts">
    import '../app.css';

    import TopBar from './topbar.svelte';
    import Modals from '$com/modals/all.svelte';
</script>

<Modals />
<div class="z-40 relative">
    <TopBar />
</div>
<div class="flex flex-row flex-grow items-stretch min-h-0">
    <slot />
</div>
