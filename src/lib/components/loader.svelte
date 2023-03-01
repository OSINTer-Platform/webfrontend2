<script lang="ts">
	export let size: string = "10rem"
	export let text: string | null = null

	import { onMount } from "svelte";

	let dotCounter = 1

	onMount(() => {
		setInterval(() => {
			dotCounter = dotCounter % 3 + 1;
		}, 1000);
	});
</script>

<div class="
	w-full
	h-full

	flex
	flex-col

	justify-center
	items-center
">
	<div style="width: {size}; height: {size};" class="
		lds-grid

		aspect-square
		grid
		grid-cols-3
		grid-rows-3
		gap-2
	">
		{#each Array(9) as _}
			<div class="
				w-full
				h-full

				rounded-full
				bg-primary-500
			"></div>
		{/each}
	</div>
	{#if text}
		<p class="mt-4 font-light capitalize">{text}{".".repeat(dotCounter)}</p>
	{/if}
</div>

<style>

.lds-grid div {
	animation: lds-grid 1.5s linear infinite;
}

.lds-grid div:nth-child(1) {
  animation-delay: 0s;
}
.lds-grid div:nth-child(2) {
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(3) {
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(4) {
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(5) {
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(6) {
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(7) {
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(8) {
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(9) {
  animation-delay: -1.6s;
}

@keyframes lds-grid {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.4;
	}
}
</style>
