<script lang="ts">
  import Fa from "svelte-fa";
  import { faCaretDown } from "@fortawesome/free-solid-svg-icons/index";

  import { slide } from "svelte/transition";

  import { page } from "$app/stores";

  import type { SidebarOption } from "$shared/types/internal";
  import { sideMenuOpen } from "$state/state";

  export let options: SidebarOption;
  export let preload: false | "tap" | "hover" = "tap";

  $: open = $sideMenuOpen[options.id] ?? true;
</script>

<!-- Title -->
{#if options.title}
  <button
    id={options.id}
    on:click={() => ($sideMenuOpen[options.id] = !open)}
    class="

		mx-2

		sm:py-2
		sm:px-4
		py-1
		px-2

		flex
		flex-row
		justify-between
		items-center

		btn
		hover:bg-surface-300/25
		dark:hover:bg-surface-400/25
	"
  >
    <span
      class="
			text-primary-700
			dark:text-primary-500

			font-bold
			uppercase
		">{options.title}</span
    >
    <Fa
      icon={faCaretDown}
      class="
			{open ? '' : '-rotate-90'}
			transition-transform
		"
    />
  </button>
{/if}

<!-- Navigation List -->
{#if !options.title || open}
  <nav class="mb-6" transition:slide>
    <ul class="">
      {#each options.list as { href, label, badge }}
        <li class="px-2">
          <a
            data-sveltekit-preload-data={preload}
            data-sveltekit-preload-code={preload}
            {href}
            class="
						px-2
						py-1

						sm:py-2
						sm:px-4

						overflow-hidden
						truncate

						font-light
						sm:text-base
						text-sm

						inline-block
						w-full

						rounded-md

						sm:dark:font-medium

						{$page.url.pathname.startsWith(href)
              ? 'bg-primary-500/25'
              : 'hover:bg-primary-500/5'}
					"
          >
            {label}
          </a>
        </li>
      {/each}
    </ul>
    <slot name="bottom" />
  </nav>
{/if}
