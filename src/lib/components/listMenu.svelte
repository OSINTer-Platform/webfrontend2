<script lang="ts">
  import Fa from "svelte-fa";
  import type { HeaderModOptions } from "$shared/types/internal";

  export let listOptions: HeaderModOptions[][] = [];
  export let containerClasses: string = "";

  $: listOptions = listOptions ?? [];
  // See https://github.com/sveltejs/svelte/issues/11647

  const buttonCss =
    "flex flex-row gap-6 hover:bg-primary-300/25 items-center justify-start w-full pl-4 p-2 sm:p-3 sm:pl-5 text-sm sm:text-base dark:hover:bg-primary-500/40";
</script>

<div
  class="
	relative

	[&:focus-within>div]:block
  {containerClasses}
"
>
  <slot />

  <div
    class="
		hidden absolute z-20
		top-12 right-0

    w-52 sm:w-64

		bg-surface-100 dark:bg-surface-800
		border border-tertiary-500

		shadow-xl
	"
  >
    <nav class="divide-y divide-tertiary-500 px-3 sm:py-2 sm:px-4">
      {#each listOptions as list}
        <ul class="py-3">
          {#each list as option}
            <li class="w-full text-left">
              {#if option.route}
                <a href={option.route} class={buttonCss} {...option.options}>
                  <Fa icon={option.icon} />
                  {option.title}
                </a>
              {:else if option.action}
                <button
                  on:click={() => option.action?.()}
                  class={buttonCss}
                  {...option.options}
                >
                  <Fa icon={option.icon} />
                  {option.title}
                </button>
              {/if}
            </li>
          {/each}
        </ul>
      {/each}
    </nav>
  </div>
</div>
