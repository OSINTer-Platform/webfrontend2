<script lang="ts">
  import Fa from "svelte-fa";

  import AppSwitcher from "./compontents/appSwitcher.svelte";
  import LinkNavShell from "./compontents/linkNav/shell.svelte";
  import LinkNavOptions from "./compontents/linkNav/optionList.svelte";
  import SidebarShell from "./compontents/shell.svelte";

  import type { SearchQuery } from "$shared/types/api";
  import type { UserItemSidebarOption } from "$shared/types/internal";
  import type { User } from "$shared/types/userItems";

  import { modalState } from "$state/modals";
  import { createItem, sanitizeQuery } from "$lib/common/userItems";
  import { goto } from "$app/navigation";
  import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
  import { page } from "$app/stores";
  import { toUrl } from "$lib/common/searchQuery";

  export let options: Array<UserItemSidebarOption> = [];
  export let user: User | null;
  export let search: boolean = false;

  const categoriesWithCreation = ["feeds", "collections"];
  type categoriesWithCreation = "feeds" | "collections";

  const creationFunctions: {
    [key in categoriesWithCreation]: () => void;
  } = {
    feeds: initiateFeedCreation,
    collections: async () => {
      await createItem("New Collection", [], "collection", "current");
    },
  };

  function initiateFeedCreation() {
    if (!user) {
      goto(
        `/login?msg=${encodeURIComponent(
          "Login down below for the ability to create new feeds"
        )}`
      );
      return;
    }

    modalState.append({
      modalType: "search",
      modalContent: {
        searchText: "Create feed",
        searchAction: async (query: SearchQuery) => {
          await createItem("New Feed", sanitizeQuery(query), "feed", "current");
        },
      },
    });
  }

  function spawnSearchModal(e: Event) {
    e.preventDefault();

    modalState.append({
      modalType: "search",
      modalContent: {
        query: $page.data?.currentSearch,
        searchText: "Search articles",
        searchAction: (q) => {
          goto(`/feed/search?${toUrl(q)}`);
        },
      },
    });
  }

  function hasButton(
    id: "feeds" | "collections" | "clusters" | "inbuilts"
  ): id is categoriesWithCreation {
    return categoriesWithCreation.includes(id);
  }
</script>

<SidebarShell>
  <svelte:fragment slot="nav">
    <AppSwitcher />
  </svelte:fragment>

  <svelte:fragment slot="content">
    {#if options.length > 0}
      <LinkNavShell>
        <a
          on:click={spawnSearchModal}
          href="/search"
          class="
          flex flex-row items-center
          mt-3 mb-6 mx-4 px-4 py-2
          border
          rounded-md
          text-sm sm:text-base md:text-lg

          transition-all
          duration-300

          hover:shadow-md
          hover:dark:shadow-primary-800
          hover:dark:border-primary-500/50

          {search
            ? 'text-primary-600 dark:text-primary-500/75 border-primary-500/50 hover:dark:text-primary-500'
            : 'text-black/30 border-surface-300 dark:border-white/25 dark:text-white/25'}
         "
        >
          <Fa
            class="border-r pr-4
            {search
              ? 'border-primary-500/50'
              : 'border-surface-300 dark:border-white/25'}"
            icon={faMagnifyingGlass}
          />
          <span class="ml-4 uppercase font-bold">Custom search</span>
        </a>
        {#each options as option}
          {#if option.list.length > 0 || (user && hasButton(option.id))}
            <LinkNavOptions options={option}>
              <svelte:fragment slot="bottom">
                {#if hasButton(option.id)}
                  <div class="px-4">
                    <button
                      on:click={creationFunctions[option.id]}
                      class="
											mt-2 sm:mb-6 w-full
											sm:px-4 sm:py-2 px-2 py-1

											grid grid-cols-[auto_1fr] items-center

											sm:text-base text-sm
											text-left text-black/30 dark:text-white/30

											border border-surface-400/30 sm:rounded-xl rounded-md

											hover:border-surface-400 hover:dark:text-white/80 hover:text-black/80

											transition-colors duration-300
										"
                    >
                      <Fa icon={faPlus} class="sm:mr-4 mr-2" />
                      <span
                        class="
												w-full
												sm:pl-4 pl-2

												border-l border-surface-400/30
												hover:border-surface-400

												transition-colors duration-300
											">Create new {option.id.slice(0, -1)}</span
                      >
                    </button>
                  </div>
                {/if}
              </svelte:fragment>
            </LinkNavOptions>
          {/if}
        {/each}
      </LinkNavShell>
    {/if}
  </svelte:fragment>
</SidebarShell>
