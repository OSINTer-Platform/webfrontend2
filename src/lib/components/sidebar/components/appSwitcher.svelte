<script lang="ts">
  import { navItems } from "$shared/nav";

  import { page } from "$app/stores";

  import Fa from "svelte-fa";
  import {
    faArrowRightToBracket,
    faGear,
  } from "@fortawesome/free-solid-svg-icons";
  import { modalState } from "$shared/state/modals";

  $: user = $page.data.user;
</script>

<div
  class="
	w-16
	sm:w-20
	h-full

	flex
	flex-col

	bg-surface-50
	dark:bg-surface-800

	border-r
	border-tertiary-600
	dark:border-surface-400

	overflow-y-auto
  scrollbar-thin
	shrink-0
"
>
  {#each Object.values(navItems) as items}
    <ul class="border-b border-surface-200 dark:border-surface-500">
      {#each items as item}
        {@const selected =
          ($page.url.pathname.startsWith(item.route) &&
            item.route.length > 1) ||
          $page.url.pathname == item.route}
        <li>
          <a
            {...item.options}
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
            <Fa icon={item.icon} class="sm:text-2xl" />
            <span class="sm:font-bold text-xs">{item.title}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/each}

  {#if $user}
    <div class="mt-auto" title="Change user settings">
      <a
        href="/settings"
        class:bg-primary-500={$page.url.pathname.startsWith("/settings")}
        class:btn={!$page.url.pathname.startsWith("/settings")}
        class="
          flex flex-col justify-center items-center gap-3
          w-full aspect-square
          border-t border-surface-200 dark:border-surface-500
      "
      >
        <Fa icon={faGear} class="sm:text-2xl -mb-2" />
        <span class="sm:font-bold text-xs">Settings</span>
      </a>
    </div>
  {:else}
    <a
      data-sveltekit-preload-data="tap"
      href="/login"
      class="
        btn
        flex flex-col justify-center
        w-full mt-auto aspect-square
        border-t border-surface-200 dark:border-surface-500
    "
    >
      <Fa icon={faArrowRightToBracket} class="sm:text-2xl -mb-2" />
      <span class="sm:font-bold text-xs">Login</span>
    </a>
  {/if}
</div>
