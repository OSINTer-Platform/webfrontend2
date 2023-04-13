<script lang="ts">
    import type { LayoutData } from './$types';

    import '../app.css';

    import TopBar from './topbar.svelte';
    import Modals from '$com/modals/all.svelte';
    import AppSwitcher from '$com/sidebar/appSwitcher.svelte';
    import { modalState } from '$shared/state';

    export let data: LayoutData;

    function handleKeypress(keyName: string) {
        switch (keyName) {
            case 'Escape':
                $modalState = { modalType: null, modalContent: null };
                break;
        }
    }
</script>

<svelte:window on:keydown={(e) => handleKeypress(e.key)} />

<Modals />
<div class="z-40 relative">
    <TopBar />
</div>
<div class="flex flex-row flex-grow items-stretch min-h-0 relative">
    {#if !data.customSidebar}
        <AppSwitcher />
    {/if}
    <slot />
</div>
