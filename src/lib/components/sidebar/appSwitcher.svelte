<script lang="ts">
    import { navItems } from '$shared/nav';

    import { page } from '$app/stores';

    import Fa from 'svelte-fa/src/fa.svelte';
</script>

<div
    class="
	w-20
	h-full

	bg-surface-50

	divide-tertiary-400
	divide-y

	border-r
	border-tertiary-600
"
>
    {#each Object.values(navItems) as items}
        <ul>
            {#each items as item}
                {@const selected =
                    $page.url.pathname.startsWith(item.route) &&
                    item.route.length > 1}
                <li>
                    <a
                        href={item.route}
                        class:bg-primary-500={selected}
                        class:btn={!selected}
                        class="
						w-full
						aspect-square

						flex
						flex-col
						gap-2
						justify-center

						text-center
					"
                    >
                        <Fa icon={item.icon} size="lg" />
                        <span class="font-bold text-xs">{item.text}</span>
                    </a>
                </li>
            {/each}
        </ul>
    {/each}
</div>
