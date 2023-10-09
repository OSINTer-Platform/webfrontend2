<script lang="ts">
  export let containerClass: string = "";
  export let halfClass: string = "";
</script>

<div
  class="
	flex flex-col
	@5xl:flex-row

	overflow-y-auto


	px-2 py-4 sm:p-8

	h-full w-full

  {containerClass}
"
>
  <div
    class="
		flex
		flex-col
		shrink-0

		w-full
		h-fit

		@5xl:h-full
		@5xl:w-1/2
		@5xl:overflow-auto

		border-tertiary-500
		dark:border-surface-400
		@5xl:border-r
		@5xl:pr-8

		@container/half

    {halfClass}
	"
  >
    <slot name="first" />
  </div>

  <div
    class="
		flex
		flex-col

		w-full
		@5xl:w-1/2
		@5xl:pl-8

		@container/half
    {halfClass}
	"
  >
    <slot name="last" />
  </div>
</div>
