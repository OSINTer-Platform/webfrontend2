<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faCaretDown } from '@fortawesome/free-solid-svg-icons/index';

    import { slide } from 'svelte/transition';

    import { page } from '$app/stores';

    import type { SidebarOption } from '$shared/nav';
    import { sideOpen } from '$shared/state';

    export let options: SidebarOption;

    $: open = $sideOpen[options.id] ?? true;
</script>

<!-- Title -->
{#if options.title}
    <button
        id={options.id}
        on:click={() => ($sideOpen[options.id] = !open)}
        class="

		mx-2
		py-2
		px-4

		flex
		flex-row
		justify-between
		items-center

		btn
		hover:bg-surface-300/25
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
    <nav class="mb-6" transition:slide|local>
        <ul class="">
            {#each options.list as { href, label, badge }}
                {@const selected = $page.url.pathname == href}
                <li class="px-2">
                    <a
                        {href}
                        class="
						py-2
						px-4

						overflow-hidden
						truncate

						font-light

						inline-block
						w-full

						rounded-xl

						{selected ? 'bg-primary-500/25' : 'hover:bg-primary-500/5'}
					"
                    >
                        {label}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
{/if}
