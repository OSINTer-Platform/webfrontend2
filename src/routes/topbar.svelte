<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import {
        faBars,
        faCaretDown,
    } from '@fortawesome/free-solid-svg-icons/index';
    import {
        faGitlab,
        faGithub,
    } from '@fortawesome/free-brands-svg-icons/index';

    import type { NavItem } from '$shared/nav';
    import { navItems } from '$shared/nav';

    import LogoFull from '$assets/LogoFull.svelte';
    import ListMenu from '$com/listMenu.svelte';
    import { sideOpen } from '$state/state';

    export let customSidebar = false;
    export let burgerMenu = false;

    const socials: Array<NavItem> = [
        {
            title: 'Gitlab',
            route: 'https://gitlab.com/OSINTer',
            icon: faGitlab,
        },
        {
            title: 'Github',
            route: 'https://github.com/bertmad3400/OSINTer',
            icon: faGithub,
        },
    ];
</script>

<header
    class="
	w-full

	flex
	flex-row
	justify-between
	items-center

	bg-surface-100
	dark:bg-surface-800

	dark:border-b
	dark:border-surface-300

	shadow-lg

	p-4
"
>
    <div class="flex items-center gap-2">
        <!-- Hamburger Menu -->
        {#if burgerMenu}
            <button
                on:click={() => {
                    $sideOpen = !$sideOpen;
                }}
                class="btn xl:!hidden p-2 rounded-xl {customSidebar
                    ? ''
                    : 'sm:hidden'}"
            >
                <Fa icon={faBars} class="text-xl" />
            </button>
        {/if}

        <!-- Logo -->
        <a
            class="w-7 xl:w-auto overflow-hidden"
            href="/"
            title="Go to Homepage"
        >
            <LogoFull class="h-8 xl:h-10" />
        </a>
    </div>

    <section
        class="
		flex
		flex-row

		md:gap-10
	"
    >
        <!-- Navigate -->
        <ListMenu listOptions={Object.values(navItems)}>
            <button
                class="
				btn

				py-2
				px-6

				rounded-xl
			"
            >
                Navigate
                <Fa icon={faCaretDown} />
            </button>
        </ListMenu>

        <!-- Social -->
        <section class="flex items-center gap-2">
            {#each socials as social}
                <a
                    class="btn p-2 rounded-full"
                    title={social.title}
                    href={social.route}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <Fa icon={social.icon} class="text-2xl" />
                </a>
            {/each}
        </section>
    </section>
</header>
