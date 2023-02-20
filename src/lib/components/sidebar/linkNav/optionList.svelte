<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faCaretDown } from '@fortawesome/free-solid-svg-icons/index';

    import { page } from '$app/stores';

    import type { SidebarOption } from '$shared/nav';

    export let options: SidebarOption;
</script>

<!-- Title -->
<div
    id={options.id}
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
    <Fa icon={faCaretDown} />
</div>
<!-- Navigation List -->
<nav class="list-nav">
    <ul>
        {#each options.list as { href, label, badge }}
            {@const selected = $page.url.pathname.endsWith(href)}
            <li class="px-2">
                <a
                    {href}
                    class:bg-primary-active-token={selected}
                    class="
					py-2
					px-4

					inline-block
					w-full

					rounded-xl

					hover:bg-primary-500/10
				"
                >
                    {label}
                </a>
            </li>
        {/each}
    </ul>
</nav>
