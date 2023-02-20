<script lang="ts">
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    import Sidebar from '$com/sidebar/main.svelte';
</script>

<div class="flex flex-row">
    <Sidebar />
    <slot />
</div>
