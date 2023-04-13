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
	{$sideOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
	lg:hidden

	flex
	absolute
	z-40

	bottom-0
	top-0

	w-screen

	bg-black/25

	transition-all
	duration-200
"
>
    <div
        on:click|stopPropagation
        on:keyup|stopPropagation
        class="
		{$sideOpen ? 'max-w-full' : 'max-w-0'}

		grid
		grid-cols-[auto_1fr]

		h-full

		bg-surface-50

		overflow-auto

		transition-[max-width]
		duration-200
	"
    >
        <slot />
    </div>
</div>
