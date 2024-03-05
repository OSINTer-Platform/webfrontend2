<script lang="ts">
  let classes: string = "w-40 h-40";
  export { classes as class };
  export let id = "";
  export let containerClass = "w-full h-full";
  export let text: string | null = null;
  export let rows: number = 3;
  export let columns: number = 3;

  import { onMount } from "svelte";

  let dotCounter = 1;

  onMount(() => {
    setInterval(() => {
      dotCounter = (dotCounter % 3) + 1;
    }, 1000);
  });
</script>

<div
  {id}
  class="
	flex
	flex-col

	justify-center
	items-center
  {containerClass}
"
>
  <div
    style="
      grid-template-rows: repeat({rows}, minmax(0, 1fr));
      grid-template-columns: repeat({columns}, minmax(0, 1fr));
    "
    class="
		lds-grid

		grid
		gap-2
		{classes}
	"
  >
    {#each Array(rows * columns) as _}
      <div
        class="
				w-full
				h-full
        aspect-square

				rounded-full
				bg-primary-500
			"
      />
    {/each}
  </div>
  {#if text}
    <p class="mt-4 font-light capitalize">
      {text}{".".repeat(dotCounter)}
    </p>
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
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
</style>
