<script lang="ts">
  import { scale, slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  import Button from "./button.svelte";

  const dispatch = createEventDispatcher();
  export let title: string;
  export let selectedRating: number | undefined = undefined;
  export let feedback = "";

  let error: undefined | string = undefined;

  function validate() {
    if (selectedRating) {
      error = undefined;
      dispatch("next");
    } else error = `Missing rating for ${title}`;
  }
</script>

<header class="flex justify-between items-end px-6 mt-6">
  <p class="block text-sm font-light mb-2">Least useful</p>
  <h2 class="block font-light text-3xl text-center mb-4">{title}</h2>
  <p class="block text-sm font-light mb-2">Most useful</p>
</header>

<div class="flex relative">
  {#each [1, 2, 3, 4, 5] as rating}
    <label
      class:checked={selectedRating === rating}
      class="w-1/5 h-20 relative cursor-pointer"
    >
      <input
        on:change={() => (error = undefined)}
        type="radio"
        value={rating}
        class="hidden"
        bind:group={selectedRating}
      />
      <p
        class="
          absolute left-1/2 -translate-x-1/2 translate-y-11
          {selectedRating === rating ? 'font-bold' : 'font-light'}
          transition-all
        "
      >
        {rating}
      </p>
    </label>
  {/each}

  <hr
    class="left-0 right-0 w-5/6 mx-auto border-surface-100/50 absolute z-10 top-1/4"
  />

  {#if selectedRating}
    <div
      transition:scale|local={{ duration: 200 }}
      class="
      pointer-events-none select-none
      z-30 w-6 h-6 bg-primary-500 rounded-full
      absolute top-1/4 -translate-y-1/2 -translate-x-1/2
      transition-all
    "
      style="left: calc(10% + (20% * ({selectedRating} - 1)))"
    />
  {/if}
</div>

<div class="my-4 font-light flex gap-4 items-center">
  <hr class="grow my-4 border-surface-400/50" />
  Elaborate on {title}
  <hr class="grow my-4 border-surface-400/50" />
</div>

<section class="my-4">
  <textarea
    bind:value={feedback}
    placeholder="(Optional feedback)"
    class="
      p-4 w-full h-32 rounded-md
      bg-surface-400/25 outline-none
      border border-surface-400/50
      placeholder-gray-400 dark:placeholder-gray-200/75
    "
  />
</section>

{#if error}
  <p class="text-error-500" transition:slide|local>{error}</p>
{/if}

<nav class="w-full flex justify-center gap-1 mt-8">
  <Button primary={false} on:click={() => dispatch("prev")}>Prev</Button>
  <Button primary={true} on:click={validate}>Next</Button>
</nav>

<style lang="postcss">
  label {
    &::before {
      @apply absolute z-20 w-12 h-12
      top-1/4 left-1/2 -translate-y-1/2 -translate-x-1/2
      bg-surface-100 dark:bg-surface-800
      rounded-full pointer-events-none select-none;

      content: " ";
    }
    &::after {
      @apply absolute z-20 w-8 h-8
      top-1/4 left-1/2 -translate-y-1/2 -translate-x-1/2
      bg-surface-100 dark:bg-surface-800
      border-2 border-primary-500
      rounded-full pointer-events-none select-none;

      content: " ";
      transition: all 0.15s ease-in-out;
    }

    &:hover::after,
    &.checked::after {
      transform: translate(-50%, -50%) scale(1.25);
    }
  }
</style>
