<script lang="ts">
    import type { LayoutData } from './$types';

    import '../app.css';

    import TopBar from './topbar.svelte';
    import Modals from '$com/modals/all.svelte';
    import { modalState } from '$state/state';

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
    <TopBar burgerMenu={data.customSidebar} />
</div>
<slot />
