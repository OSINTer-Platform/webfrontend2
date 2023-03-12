<script lang="ts">
    import { modalState } from '$shared/state';
    import { fly, fade } from 'svelte/transition';

    let classes: string = '';
    export { classes as class };
</script>

<div
    on:click={() => ($modalState = { modalType: null, modalContent: null })}
    transition:fade={{ duration: 200 }}
    class="
	z-50

	absolute

	h-screen
	w-screen

	flex
	flex-col
	items-center
	justify-center

	bg-black/60
"
>
    <div
        role="button"
        on:click|stopPropagation
        in:fly={{ y: 50 }}
        out:fly={{ y: 50 }}
        class="
		bg-white
		overflow-auto
		cursor-auto
		{classes}
	"
    >
        <slot />
    </div>
</div>
