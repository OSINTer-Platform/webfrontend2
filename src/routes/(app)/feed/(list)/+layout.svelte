<script lang="ts">
    import { beforeNavigate } from '$app/navigation';
    import { navigating } from '$app/stores';
    import Loader from '$com/loader.svelte';

    let showLoader = false;

    beforeNavigate(() => {
        showLoader = false;

        setTimeout(() => (showLoader = true), 250);
    });
</script>

<main
    class="
	flex
	flex-col
	grow

	items-stretch
	overflow-y-auto
	overflow-x-hidden

	bg-surface-50
	dark:bg-surface-800
"
>
    {#if $navigating && showLoader}
        <Loader text="Loading feed" />
    {:else}
        <slot />
    {/if}
</main>
