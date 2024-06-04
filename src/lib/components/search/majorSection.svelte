<script lang="ts">
  import Fa from "svelte-fa";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
  import { slide } from "svelte/transition";

  export let title: string;

  let open = true;
</script>

<button
  type="button"
  on:click={() => (open = !open)}
  class="
	flex
	justify-between

	sm:mb-4
	py-2
	px-4

	btn

"
>
  <h1
    class="
		font-light
		text-xl
		dark:font-bold
	"
  >
    {title}
  </h1>
  <Fa
    icon={faCaretDown}
    class="@5xl/full:hidden transition-transform {open ? '' : '-rotate-90'}"
  />
</button>

<section
  transition:slide
  class="
		flex
		flex-col

		min-h-0

		@5xl/full:h-full
		overflow-y-hidden
		{open ? 'h-full' : 'h-0'}

		transition-[height]
		duration-700

"
>
  <slot />
</section>
