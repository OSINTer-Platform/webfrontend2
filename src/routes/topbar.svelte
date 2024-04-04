<script lang="ts">
  import Fa from "svelte-fa";
  import {
    faArrowRightFromBracket,
    faArrowRightToBracket,
    faBars,
    faCaretDown,
    faHandHoldingDollar,
  } from "@fortawesome/free-solid-svg-icons/index";
  import { faGithub } from "@fortawesome/free-brands-svg-icons/index";

  import { navItems } from "$shared/nav";
  import { sideOpen } from "$state/state";

  import type { NavItem } from "$shared/types/internal";
  import LogoFull from "$assets/LogoFull.svelte";
  import ListMenu from "$com/listMenu.svelte";
  import LightSwitch from "$com/lightSwitch.svelte";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { sponsorLink } from "$shared/config";

  let socials: Array<NavItem>;
  let showSponser = false;

  $: user = $page.data.user;

  $: socials = [
    {
      title: "Source-code",
      route: "https://github.com/OSINTer-Platform",
      blank: true,
      icon: faGithub,
    },
  ];

  onMount(() => {
    if (Math.floor(Math.random() * 20) == 0) showSponser = true;
  });
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
          btn xl:!hidden p-2 rounded-xl
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
    {#if showSponser}
      <a
        class="btn py-2 px-6 rounded-xl"
        href={sponsorLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Sponsor us
        <Fa icon={faHandHoldingDollar} />
      </a>
    {:else}
      <ListMenu
        listOptions={Object.values(navItems)}
        containerClasses="hidden sm:block"
      >
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
    {/if}

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

    <section class="flex items-center md:gap-3 gap-2">
      {#if $user}
        <form method="POST" action="/logout" use:enhance>
          <button title="Logout" type="submit" class="btn p-2 rounded-full">
            <Fa icon={faArrowRightFromBracket} class="text-xl" />
          </button>
        </form>
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
