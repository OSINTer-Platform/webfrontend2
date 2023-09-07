<script lang="ts">
  import Fa from "svelte-fa/src/fa.svelte";
  import {
    faArrowRightToBracket,
    faArrowRightFromBracket,
    faBars,
    faCaretDown,
  } from "@fortawesome/free-solid-svg-icons/index";
  import { faGitlab } from "@fortawesome/free-brands-svg-icons/index";

  import { navItems } from "$shared/nav";
  import { sideOpen } from "$state/state";

  import type { User } from "$shared/types/userItems";
  import type { NavItem } from "$shared/types/internal";
  import LogoFull from "$assets/LogoFull.svelte";
  import ListMenu from "$com/listMenu.svelte";
  import LightSwitch from "$com/lightSwitch.svelte";

  export let customSidebar = false;
  export let burgerMenu = false;
  export let user: User | null;

  let socials: Array<NavItem>;

  $: socials = [
    {
      title: "Source-code",
      route: "https://gitlab.com/OSINTer",
      blank: true,
      icon: faGitlab,
    },
    ...(user
      ? [{ title: "Logout", route: "/logout", icon: faArrowRightFromBracket }]
      : [{ title: "Login", route: "/login", icon: faArrowRightToBracket }]),
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
        class="btn xl:!hidden p-2 rounded-xl {customSidebar ? '' : 'sm:hidden'}"
      >
        <Fa icon={faBars} class="text-xl" />
      </button>
    {/if}

    <!-- Logo -->
    <a class="w-7 xl:w-auto overflow-hidden" href="/" title="Go to Homepage">
      <LogoFull class="h-8 xl:h-10" />
    </a>
  </div>

  <section
    class="
		flex
		flex-row

		md:gap-8
    gap-2
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

    <LightSwitch />

    <!-- Social -->
    <section class="flex items-center md:gap-3 gap-2">
      {#each socials as social}
        <a
          class="btn p-2 rounded-full"
          title={social.title}
          href={social.route}
          target={social.blank ? "_blank" : ""}
          rel="noreferrer noopener"
          data-sveltekit-preload-data="tap"
        >
          <Fa icon={social.icon} class="text-xl" />
        </a>
      {/each}
    </section>
  </section>
</header>
