<script lang="ts">
  import { sideOpen } from "$state/state";
</script>

<div
  class="
	hidden

	xl:grid
	grid-cols-[auto_1fr]

	shrink-0

	overflow-auto
"
>
  <slot name="nav" />
  <slot name="content" />
</div>

<span class="hidden md:block xl:hidden">
  <slot name="nav" />
</span>
<div
  role="presentation"
  on:click={() => ($sideOpen = !$sideOpen)}
  on:keyup={() => ($sideOpen = !$sideOpen)}
  class="
	{$sideOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
	xl:hidden

	flex
	absolute
	z-30

	bottom-0
	top-0

	w-screen

	bg-black/25
	dark:bg-black/50

	transition-all
	duration-200
"
>
  <div
    role="menubar"
    tabindex="0"
    on:click|stopPropagation
    on:keyup|stopPropagation
    class="
		{$sideOpen ? 'max-w-full' : 'max-w-0'}

		grid
		grid-cols-[auto_1fr]

		h-full

		overflow-auto

		transition-[max-width]
		duration-200
	"
  >
    <slot name="nav" />
    <slot name="content" />
  </div>
</div>
