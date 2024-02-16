<script lang="ts">
  import { navItems } from "$shared/nav";

  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  import Fa from "svelte-fa";
  import {
    faArrowRightFromBracket,
    faArrowRightToBracket,
  } from "@fortawesome/free-solid-svg-icons";

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

	overflow-auto
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
						
						{selected ? 'bg-primary-500 dark:text-white' : ''}
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
    <form method="POST" action="/logout" class="mt-auto" use:enhance>
      <button
        type="submit"
        class="
        btn
        flex flex-col justify-center
        w-full aspect-square
        border-t border-surface-200 dark:border-surface-500
      "
      >
        <Fa icon={faArrowRightFromBracket} class="sm:text-2xl -mb-2" />
        <span class="sm:font-bold text-xs">Logout</span>
      </button>
    </form>
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
