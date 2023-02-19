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

<header class="
	w-full

	flex
	flex-row
	justify-between

	bg-surface-100
	dark:bg-surface-800

	shadow-lg

	p-6
">
	<div class="flex items-center gap-8">
		<!-- Hamburger Menu -->
		<button on:click={() => {}} class="btn lg:!hidden p-2 rounded-xl">
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

	<section class="
		flex
		flex-row

		gap-10
	">
		<!-- Navigate -->
		<div class="
			relative

			hidden
			lg:block

			[&:focus-within>div]:block
		">
			<button class="
				btn

				py-2
				px-6

				rounded-xl
			">
				Navigate
				<Fa icon={faCaretDown} />
			</button>
			<div class="
				hidden
				absolute

				top-12
				right-0

				bg-surface-100
				rounded-xl

				border-tertiary-500
				border

				w-64

				shadow-xl
			">
				<nav class="divide-y divide-tertiary-500 py-2 px-4">
					{#each Object.values(navItems) as items}
						<ul class="py-3">
							{#each items as item}
								<li class="w-full text-left">
									<a href={item.route} class="
										flex
										flex-row
										gap-6

										hover:bg-primary-300/25

										items-center
										justify-start

										rounded-xl

										w-full
										p-3
										pl-5
									">
										<Fa icon={item.icon} />
										{item.text}
									</a>
								</li>
							{/each}
						</ul>
					{/each}
				</nav>
			</div>
		</div>

		<!-- Social -->
		<section class="flex items-center gap-2">
			{#each socials as social}
				<a
					class="btn p-2 rounded-full"
					title={social.text}
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
