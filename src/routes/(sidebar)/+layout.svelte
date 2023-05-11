<script lang="ts">
    import type { LayoutData } from './$types';
    import AppSwitcher from '$com/sidebar/appSwitcher.svelte';

    export let data: LayoutData;
</script>

<div class="flex flex-row flex-grow items-stretch min-h-0 relative">
    {#if !data.customSidebar}
        <AppSwitcher />
    {/if}
    <slot />
</div>
