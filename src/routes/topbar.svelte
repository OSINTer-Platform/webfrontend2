<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faArrowRightToBracket,
    faBars,
    faCaretDown,
  } from "@fortawesome/free-solid-svg-icons/index";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/index";

  import { navItems } from "$shared/nav";
  import { sideOpen } from "$state/state";

  import type { NavItem } from "$shared/types/internal";
  import LogoFull from "$assets/LogoFull.svelte";
  import ListMenu from "$com/listMenu.svelte";
  import LightSwitch from "$com/lightSwitch.svelte";
  import { page } from "$app/stores";
  import { faUser } from "@fortawesome/free-regular-svg-icons";
  import { modalState } from "$shared/state/modals";

  let socials: Array<NavItem>;

  $: user = $page.data.user;

  $: socials = [
    {
      title: "Source-code",
      route: "https://github.com/OSINTer-Platform",
      icon: faGithub,
      options: {
        target: "_blank",
      },
    },
  ];
</script>

<header
  class="
  w-full
  p-4 flex flex-row
  justify-between items-center
"
>
  <div class="flex items-center gap-2">
    <!-- Hamburger Menu -->
    {#if $page.data.burgerMenu ?? true}
      <button
        on:click={() => {
          $sideOpen = !$sideOpen;
        }}
        class="
          btn xl:!hidden p-2
          {$page.data.customSidebar ? '' : 'sm:hidden'}
        "
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

    md:gap-8 gap-2
  "
  >
    <ListMenu
      listOptions={Object.values(navItems)}
      containerClasses="hidden sm:block"
    >
      <button class="btn py-2 px-6 rounded-sm">
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
          rel="noreferrer noopener"
          data-sveltekit-preload-data="tap"
          {...social.options}
        >
          <Fa icon={social.icon} class="text-xl" />
        </a>
      {/each}
    </section>

    <section class="flex items-center md:gap-3 gap-2">
      {#if $user}
        <a href="/settings" title="User settings" class="btn p-2 rounded-full">
          <Fa icon={faUser} class="text-xl" />
        </a>
      {:else}
        <a
          data-sveltekit-preload-data="tap"
          href="/login"
          class="btn p-2 rounded-full"
        >
          <Fa icon={faArrowRightToBracket} class="text-xl" />
        </a>
      {/if}
    </section>
  </section>
</header>
