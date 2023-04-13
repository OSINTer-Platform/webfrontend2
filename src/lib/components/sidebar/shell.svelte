<script lang="ts">
    import { sideOpen } from '$shared/state';
</script>

<div
    class="
	hidden

	lg:grid
	grid-cols-[auto_1fr]

	shrink-0

	bg-surface-50

	overflow-auto
"
>
    <slot />
</div>

<div
    on:click={() => ($sideOpen = !$sideOpen)}
    on:keyup={() => ($sideOpen = !$sideOpen)}
    class="
	{$sideOpen ? 'flex' : 'hidden'}
	lg:hidden

	absolute
	z-40

	w-screen
	bottom-0
	top-0

	bg-black/25
"
>
    <div
        on:click|stopPropagation
        on:keyup|stopPropagation
        class="
		grid
		grid-cols-[auto_1fr]

		h-full

		bg-surface-50

		overflow-auto
	"
    >
        <slot />
    </div>
</div>
