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

    const socials: Array<NavItem> = [
        {
            text: 'Gitlab',
            route: 'https://gitlab.com/OSINTer',
            icon: faGitlab,
        },
        {
            text: 'Github',
            route: 'https://github.com/bertmad3400/OSINTer',
            icon: faGithub,
        },
    ];
</script>

	<div class="flex items-center space-x-4">
		<!-- Hamburger Menu -->
		<button on:click={} class="btn-icon btn-icon-sm lg:!hidden">
			<Fa icon={faBars} class="text-xl" />
		</button>

		<!-- Logo -->
		<a
			class="lg:!ml-0 w-[38px] lg:w-auto overflow-hidden"
			href="/"
			title="Go to Homepage"
		>
			<LogoFull />
		</a>
	</div>

	<!-- Navigate -->
	<div class="relative hidden lg:block">
		<button
			class="btn hover:variant-soft-primary"
		>
			<span>Navigate</span>
			<Fa icon={faCaretDown} />
		</button>
		<div class="card w-60 py-1 shadow-xl" data-menu="features">
			<nav class="list-nav divide-y divide-tertiary-500">
				{#each Object.values(navItems) as items}
					<ul class="p-2">
						{#each items as item}
							<li>
								<a href={item.route}>
									<span class="w-6 text-center"
										><Fa icon={item.icon} /></span
									>
									<span>{item.text}</span>
								</a>
							</li>
						{/each}
					</ul>
				{/each}
			</nav>
		</div>
	</div>

	<!-- Social -->
	<section class="flex space-x-2">
		{#each socials as social}
			<a
				class="btn-icon hover:variant-soft-primary"
				title={social.text}
				href={social.route}
				target="_blank"
				rel="noreferrer noopener"
			>
				<Fa icon={social.icon} class="text-2xl" />
			</a>
		{/each}
	</section>
