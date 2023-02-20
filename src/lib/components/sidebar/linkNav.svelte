<script lang="ts">
    import type { SidebarOptions } from '$shared/nav';

    import { page } from '$app/stores';

    import Fa from 'svelte-fa/src/fa.svelte';
    import { faCaretDown } from '@fortawesome/free-solid-svg-icons/index';

    export let navItems: SidebarOptions = [
        {
            id: 'feeds',
            title: 'Feeds',
            list: [
                { href: '/feed/articles/23234234', label: 'Test-Feed' },
                { href: '/feed/articles/23234234', label: 'Test-Feed' },
                { href: '/feed/articles/23234234', label: 'Test-Feed' },
            ],
        },
        {
            id: 'feeds',
            title: 'Feeds',
            list: [
                { href: '/feed/articles/23234234', label: 'Test-Feed' },
                { href: '/feed/articles/23234234', label: 'Test-Feed' },
                { href: '/feed/articles/23234234', label: 'Test-Feed' },
            ],
        },
        {
            id: 'feeds',
            title: 'Feeds',
            list: [
                { href: '/feed/articles/23234234', label: 'Test-Feed' },
                { href: '/feed/articles/23234234', label: 'Test-Feed' },
                { href: '/feed/articles/23234234', label: 'Test-Feed' },
            ],
        },
    ];
</script>

<section
    class="
	p-4
	pb-20

	space-y-2

	bg-surface-50

	border-r
	border-tertiary-600
"
>
    {#each navItems as { id, title, list }, i}
        {#if list.length > 0}
            <!-- Title -->
            <div
                {id}
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
				">{title}</span
                >
                <Fa icon={faCaretDown} />
            </div>
            <!-- Navigation List -->
            <nav class="list-nav">
                <ul>
                    {#each list as { href, label, badge }}
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
            <!-- Divider -->
            {#if i + 1 < navItems.length}<hr class="!my-6 opacity-10" />{/if}
        {/if}
    {/each}
</section>
